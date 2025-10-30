import { PsnAdapter } from '../adapters/http/psn.adapter.js';
import { AchievementRepository } from '../db/repositories/achievement.repository.js';
import { GameRepository } from '../db/repositories/game.repository.js';
import { UserGameRepository } from '../db/repositories/user-game.repository.js';

export class PsnService {
  constructor(
    private readonly adapter: PsnAdapter,
    private readonly gameRepository: GameRepository,
    private readonly userGameRepository: UserGameRepository,
    private readonly achievementRepository: AchievementRepository
  ) {}

  async createAuthorizationUrl(state: string): Promise<string> {
    return this.adapter.getAuthorizationUrl(state);
  }
}
