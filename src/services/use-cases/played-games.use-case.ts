import { Platform } from '@prisma/client';

import { CacheAdapter } from '../../adapters/cache.adapter.js';
import { ProgressService } from '../progress.service.js';

export interface PlayedGamesViewModel {
  games: Array<{ name: string; hoursPlayed: number; lastPlayedAt: Date | null }>;
}

export class PlayedGamesUseCase {
  constructor(
    private readonly progressService: ProgressService,
    private readonly cache: CacheAdapter
  ) {}

  async execute(
    userId: string,
    platform: Platform,
    range: '7d' | '30d' | 'all',
    page: number
  ): Promise<PlayedGamesViewModel> {
    const cacheKey = `played:${platform}:${userId}:${range}:${page}`;
    const cached = await this.cache.get<PlayedGamesViewModel>(cacheKey);
    if (cached) {
      return cached;
    }

    const result: PlayedGamesViewModel = { games: [] };
    await this.cache.set(cacheKey, result, { ttlSeconds: 1800 });
    return result;
  }
}
