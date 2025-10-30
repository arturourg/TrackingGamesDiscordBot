import { Platform } from '@prisma/client';

import { CacheAdapter } from '../../adapters/cache.adapter.js';
import { ProgressService } from '../progress.service.js';

export interface BacklogViewModel {
  games: Array<{ name: string; completionPct: number; hoursPlayed: number }>;
}

export class BacklogUseCase {
  constructor(
    private readonly progressService: ProgressService,
    private readonly cache: CacheAdapter
  ) {}

  async execute(userId: string, platform: Platform): Promise<BacklogViewModel> {
    const cacheKey = `backlog:${platform}:${userId}`;
    const cached = await this.cache.get<BacklogViewModel>(cacheKey);
    if (cached) {
      return cached;
    }

    const result: BacklogViewModel = { games: [] };
    await this.cache.set(cacheKey, result, { ttlSeconds: 1800 });
    return result;
  }
}
