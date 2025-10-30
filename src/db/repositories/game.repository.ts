import { Platform, type Game } from '@prisma/client';

import { prisma } from '../client.js';

export class GameRepository {
  async upsertGame(data: {
    platform: Platform;
    appId: string;
    name: string;
    iconUrl?: string | null;
    totalAchievements: number;
  }): Promise<Game> {
    return prisma.game.upsert({
      where: { platform_appId: { platform: data.platform, appId: data.appId } },
      update: {
        name: data.name,
        iconUrl: data.iconUrl ?? null,
        totalAchievements: data.totalAchievements
      },
      create: {
        platform: data.platform,
        appId: data.appId,
        name: data.name,
        iconUrl: data.iconUrl ?? null,
        totalAchievements: data.totalAchievements
      }
    });
  }

  async findByPlatformAndName(platform: Platform, query: string): Promise<Game[]> {
    return prisma.game.findMany({
      where: {
        platform,
        name: { contains: query, mode: 'insensitive' }
      },
      take: 10,
      orderBy: { name: 'asc' }
    });
  }
}
