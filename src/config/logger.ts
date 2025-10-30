import pino from 'pino';

import { env } from './env.js';

export const logger = pino({
  name: 'tracking-games-bot',
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:standard' }
        }
      : undefined
});
