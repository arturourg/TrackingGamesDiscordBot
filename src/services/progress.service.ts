import type { Platform } from '@prisma/client';

import { GameRepository } from '../db/repositories/game.repository.js';
import { UserAchievementRepository } from '../db/repositories/user-achievement.repository.js';
import { UserGameRepository } from '../db/repositories/user-game.repository.js';

export interface TrophySummary {
  earned: number;
  total: number;
  completionPct: number;
  recent: Array<{ name: string; earnedAt: Date | null }>;
}

export class ProgressService {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly userGameRepository: UserGameRepository,
    private readonly userAchievementRepository: UserAchievementRepository
  ) {}

  async getTrophySummary(_userId: string, _platform: Platform): Promise<TrophySummary> {
    return {
      earned: 0,
      total: 0,
      completionPct: 0,
      recent: []
    };
  }
}
