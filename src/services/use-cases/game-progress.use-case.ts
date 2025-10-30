import { Platform } from '@prisma/client';

import { CacheAdapter } from '../../adapters/cache.adapter.js';
import { ProgressService } from '../progress.service.js';

export interface GameProgressViewModel {
  completionPct: number;
  pendingAchievements: string[];
}

export class GameProgressUseCase {
  constructor(
    private readonly progressService: ProgressService,
    private readonly cache: CacheAdapter
  ) {}

  async execute(userId: string, platform: Platform, query: string): Promise<GameProgressViewModel> {
    const cacheKey = `progress:${platform}:${userId}:${query}`;
    const cached = await this.cache.get<GameProgressViewModel>(cacheKey);
    if (cached) {
      return cached;
    }

    const progress: GameProgressViewModel = {
      completionPct: 0,
      pendingAchievements: []
    };

    await this.cache.set(cacheKey, progress, { ttlSeconds: 900 });
    return progress;
  }
}
