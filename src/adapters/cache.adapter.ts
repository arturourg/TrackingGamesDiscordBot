import Redis from 'ioredis';

import { env } from '../config/env.js';

interface CacheOptions {
  ttlSeconds?: number;
}

export class CacheAdapter {
  private readonly client = new Redis(env.REDIS_URL);

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    if (options?.ttlSeconds) {
      await this.client.set(key, JSON.stringify(value), 'EX', options.ttlSeconds);
      return;
    }
    await this.client.set(key, JSON.stringify(value));
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}
