import { PrismaClient, Platform } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const user = await prisma.user.upsert({
    where: { discordUserId: '1234567890' },
    update: {},
    create: { discordUserId: '1234567890' }
  });

  const game = await prisma.game.upsert({
    where: { platform_appId: { platform: Platform.steam, appId: '730' } },
    update: { name: 'Counter-Strike 2', totalAchievements: 10 },
    create: {
      platform: Platform.steam,
      appId: '730',
      name: 'Counter-Strike 2',
      totalAchievements: 10
    }
  });

  await prisma.userGame.upsert({
    where: { userId_gameId: { userId: user.id, gameId: game.id } },
    update: { completionPct: 40, earnedAchievements: 4, hoursPlayed: 12.5 },
    create: {
      userId: user.id,
      gameId: game.id,
      completionPct: 40,
      earnedAchievements: 4,
      hoursPlayed: 12.5
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
