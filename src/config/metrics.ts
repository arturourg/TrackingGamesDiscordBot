import http from 'node:http';

import client from 'prom-client';

import { env } from './env.js';
import { logger } from './logger.js';

client.collectDefaultMetrics();

let server: http.Server | undefined;

export const metrics = {
  apiRequestDuration: new client.Histogram({
    name: 'api_request_duration_seconds',
    help: 'Duración de las llamadas a APIs externas',
    labelNames: ['service', 'status'] as const,
    buckets: [0.1, 0.3, 0.5, 1, 2, 5]
  }),
  commandCounter: new client.Counter({
    name: 'discord_commands_total',
    help: 'Comandos ejecutados',
    labelNames: ['command'] as const
  }),
  cacheHitRatio: new client.Gauge({
    name: 'cache_hit_ratio',
    help: 'Ratio de aciertos de caché',
    labelNames: ['resource'] as const
  })
};

export function setupMetrics(): void {
  if (server) {
    return;
  }

  server = http.createServer(async (_req, res) => {
    res.writeHead(200, { 'Content-Type': client.register.contentType });
    res.end(await client.register.metrics());
  });

  server.listen(Number(env.METRICS_PORT), () => {
    logger.info({ port: env.METRICS_PORT }, 'Servidor de métricas escuchando');
  });
}
