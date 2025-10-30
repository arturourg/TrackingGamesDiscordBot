import { UserGameRepository } from '../db/repositories/user-game.repository.js';

export interface CompareResult {
  rankings: Array<{ userId: string; completionPct: number; earnedAchievements: number }>;
}

export class CompareService {
  constructor(private readonly userGameRepository: UserGameRepository) {}

  async compareUsers(gameId: string, userIds: string[]): Promise<CompareResult> {
    const userGames = await this.userGameRepository.findByUsersAndGame(userIds, gameId);
    return {
      rankings: userGames
        .map((userGame) => ({
          userId: userGame.userId,
          completionPct: userGame.completionPct,
          earnedAchievements: userGame.earnedAchievements
        }))
        .sort((a, b) => b.completionPct - a.completionPct)
    };
  }
}
