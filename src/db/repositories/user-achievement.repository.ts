import type { UserAchievement } from '@prisma/client';

import { prisma } from '../client.js';

export class UserAchievementRepository {
  async upsertMany(achievements: Array<Omit<UserAchievement, 'id'>>): Promise<void> {
    const operations = achievements.map((achievement) =>
      prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId: achievement.userId,
            achievementId: achievement.achievementId
          }
        },
        update: {
          earned: achievement.earned,
          earnedAt: achievement.earnedAt
        },
        create: achievement
      })
    );
    await prisma.$transaction(operations);
  }
}
