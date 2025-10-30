import type { User } from '@prisma/client';

import { prisma } from '../client.js';

export class UserRepository {
  async findOrCreate(discordUserId: string): Promise<User> {
    return prisma.user.upsert({
      where: { discordUserId },
      update: {},
      create: { discordUserId }
    });
  }
}
