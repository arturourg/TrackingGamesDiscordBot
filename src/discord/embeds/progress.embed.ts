import type { APIEmbed, APIEmbedField } from 'discord.js';

import type { GameProgressViewModel } from '../../services/use-cases/game-progress.use-case.js';

export function buildGameProgressEmbed(
  platform: string,
  gameName: string,
  progress: GameProgressViewModel
): APIEmbed {
  const color = platform === 'steam' ? 0x1b2838 : 0x003791;
  const fields: APIEmbedField[] = [
    {
      name: 'Progreso',
      value: `${progress.completionPct.toFixed(1)}%`,
      inline: true
    },
    {
      name: 'Logros pendientes',
      value:
        progress.pendingAchievements.length > 0
          ? progress.pendingAchievements.map((achievement) => `• ${achievement}`).join('\n')
          : 'Todo al día ✅'
    }
  ];

  return {
    title: `${platform === 'steam' ? '🎮' : '🕹️'} ${gameName}`,
    color,
    fields
  };
}
