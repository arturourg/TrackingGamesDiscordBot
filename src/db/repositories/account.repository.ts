import { Platform, type Account } from '@prisma/client';

import { prisma } from '../client.js';

export class AccountRepository {
  async findByUserAndPlatform(userId: string, platform: Platform): Promise<Account | null> {
    return prisma.account.findFirst({ where: { userId, platform } });
  }

  async upsertAccount(data: {
    userId: string;
    platform: Platform;
    externalId: string;
    displayName: string;
    tokensEncrypted: Buffer;
    refreshTokenEncrypted?: Buffer | null;
    accessTokenExpiresAt?: Date | null;
  }): Promise<Account> {
    return prisma.account.upsert({
      where: { userId_platform: { userId: data.userId, platform: data.platform } },
      update: {
        externalId: data.externalId,
        displayName: data.displayName,
        tokensEncrypted: data.tokensEncrypted,
        refreshTokenEncrypted: data.refreshTokenEncrypted ?? null,
        accessTokenExpiresAt: data.accessTokenExpiresAt ?? null
      },
      create: {
        userId: data.userId,
        platform: data.platform,
        externalId: data.externalId,
        displayName: data.displayName,
        tokensEncrypted: data.tokensEncrypted,
        refreshTokenEncrypted: data.refreshTokenEncrypted ?? null,
        accessTokenExpiresAt: data.accessTokenExpiresAt ?? null
      }
    });
  }
}
