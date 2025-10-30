import type { Achievement } from '@prisma/client';

import { prisma } from '../client.js';

export class AchievementRepository {
  async upsertMany(achievements: Array<Omit<Achievement, 'id'>>): Promise<void> {
    const operations = achievements.map((achievement) =>
      prisma.achievement.upsert({
        where: {
          gameId_extKey: {
            gameId: achievement.gameId,
            extKey: achievement.extKey
          }
        },
        update: {
          name: achievement.name,
          description: achievement.description,
          rarity: achievement.rarity,
          isHidden: achievement.isHidden,
          iconUrl: achievement.iconUrl
        },
        create: achievement
      })
    );
    await prisma.$transaction(operations);
  }
}
