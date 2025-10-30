import type { Platform, UserGame } from '@prisma/client';

import { prisma } from '../client.js';

export class UserGameRepository {
  async upsertUserGame(data: {
    userId: string;
    gameId: string;
    lastPlayedAt?: Date | null;
    hoursPlayed?: number;
    completionPct?: number;
    earnedAchievements?: number;
    status?: string;
  }): Promise<UserGame> {
    return prisma.userGame.upsert({
      where: { userId_gameId: { userId: data.userId, gameId: data.gameId } },
      update: {
        lastPlayedAt: data.lastPlayedAt ?? null,
        hoursPlayed: data.hoursPlayed ?? 0,
        completionPct: data.completionPct ?? 0,
        earnedAchievements: data.earnedAchievements ?? 0,
        status: data.status ?? 'pending'
      },
      create: {
        userId: data.userId,
        gameId: data.gameId,
        lastPlayedAt: data.lastPlayedAt ?? null,
        hoursPlayed: data.hoursPlayed ?? 0,
        completionPct: data.completionPct ?? 0,
        earnedAchievements: data.earnedAchievements ?? 0,
        status: data.status ?? 'pending'
      }
    });
  }

  async findPlayedGames(
    userId: string,
    platform: Platform,
    take: number,
    skip: number,
    range?: '7d' | '30d' | 'all'
  ): Promise<UserGame[]> {
    const dateFilter = range && range !== 'all' ? new Date(Date.now() - parseRange(range)) : undefined;

    return prisma.userGame.findMany({
      where: {
        userId,
        game: { platform },
        ...(dateFilter ? { lastPlayedAt: { gte: dateFilter } } : {})
      },
      orderBy: { lastPlayedAt: 'desc' },
      skip,
      take,
      include: { game: true }
    });
  }

  async findBacklog(userId: string, platform: Platform): Promise<UserGame[]> {
    return prisma.userGame.findMany({
      where: {
        userId,
        game: { platform },
        OR: [
          { completionPct: { lt: 100 }, earnedAchievements: { gt: 0 } },
          { completionPct: { lt: 100 }, hoursPlayed: { gt: 0 } }
        ]
      },
      orderBy: [{ completionPct: 'asc' }, { hoursPlayed: 'desc' }],
      include: { game: true }
    });
  }

  async findByUsersAndGame(userIds: string[], gameId: string): Promise<UserGame[]> {
    return prisma.userGame.findMany({
      where: { userId: { in: userIds }, gameId },
      include: { user: true }
    });
  }
}

function parseRange(range: '7d' | '30d'): number {
  return range === '7d' ? 7 * 24 * 3600 * 1000 : 30 * 24 * 3600 * 1000;
}
