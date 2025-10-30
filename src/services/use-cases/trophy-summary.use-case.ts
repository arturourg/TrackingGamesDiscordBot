import { Platform } from '@prisma/client';

import { CacheAdapter } from '../../adapters/cache.adapter.js';
import { ProgressService } from '../progress.service.js';

export interface TrophySummaryViewModel {
  earned: number;
  total: number;
  completionPct: number;
  recent: Array<{ name: string; earnedAt: Date | null }>;
}

export class TrophySummaryUseCase {
  constructor(
    private readonly progressService: ProgressService,
    private readonly cache: CacheAdapter
  ) {}

  async execute(userId: string, platform: Platform): Promise<TrophySummaryViewModel> {
    const cacheKey = `trophies:${platform}:${userId}`;
    const cached = await this.cache.get<TrophySummaryViewModel>(cacheKey);
    if (cached) {
      return cached;
    }

    const summary = await this.progressService.getTrophySummary(userId, platform);
    await this.cache.set(cacheKey, summary, { ttlSeconds: 900 });
    return summary;
  }
}
