import dotenvFlow from 'dotenv-flow';
import { z } from 'zod';

const result = dotenvFlow.config({ silent: true });

if (result.error) {
  throw result.error;
}

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DISCORD_TOKEN: z.string().min(1, 'DISCORD_TOKEN requerido'),
  DISCORD_APP_ID: z.string().min(1),
  DISCORD_PUBLIC_KEY: z.string().min(1),
  STEAM_API_KEY: z.string().optional(),
  PSN_CLIENT_ID: z.string().optional(),
  PSN_CLIENT_SECRET: z.string().optional(),
  PSN_REDIRECT_URI: z.string().optional(),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  TOKEN_ENCRYPTION_KEY: z.string().min(32, 'TOKEN_ENCRYPTION_KEY debe tener al menos 32 caracteres'),
  METRICS_PORT: z.string().default('9090')
});

export const env = schema.parse(process.env);

export type Env = typeof env;
