import { Platform } from '@prisma/client';

import { CacheAdapter } from '../../adapters/cache.adapter.js';
import { CompareService } from '../compare.service.js';

export interface CompareUsersViewModel {
  rankings: Array<{ userId: string; completionPct: number; earnedAchievements: number }>;
}

export class CompareUsersUseCase {
  constructor(
    private readonly compareService: CompareService,
    private readonly cache: CacheAdapter
  ) {}

  async execute(
    gameId: string,
    platform: Platform,
    userIds: string[]
  ): Promise<CompareUsersViewModel> {
    const cacheKey = `compare:${platform}:${gameId}:${userIds.sort().join(',')}`;
    const cached = await this.cache.get<CompareUsersViewModel>(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.compareService.compareUsers(gameId, userIds);
    await this.cache.set(cacheKey, result, { ttlSeconds: 1800 });
    return result;
  }
}
