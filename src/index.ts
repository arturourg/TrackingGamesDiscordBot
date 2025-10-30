import './config/env.js';

import { startDiscordBot } from './discord/client.js';
import { logger } from './config/logger.js';
import { setupMetrics } from './config/metrics.js';
import { createJobSchedulers } from './jobs/schedulers/index.js';

async function bootstrap(): Promise<void> {
  try {
    setupMetrics();
    await startDiscordBot();
    await createJobSchedulers();
    logger.info({ msg: 'Bot iniciado correctamente' });
  } catch (error) {
    logger.error({ err: error }, 'Fallo crítico durante el arranque');
    process.exitCode = 1;
  }
}

void bootstrap();
