import type { APIEmbed } from 'discord.js';

import type { CompareUsersViewModel } from '../../services/use-cases/compare-users.use-case.js';

export function buildCompareEmbed(
  platform: string,
  gameName: string,
  payload: CompareUsersViewModel
): APIEmbed {
  const lines = payload.rankings
    .map((ranking, index) =>
      `${index + 1}. <@${ranking.userId}> — ${ranking.completionPct.toFixed(1)}% (${ranking.earnedAchievements} logros)`
    )
    .join('\n');

  return {
    title: `${platform === 'steam' ? '🎮' : '🕹️'} Comparativa — ${gameName}`,
    description: lines || 'Sin datos suficientes para comparar.',
    color: platform === 'steam' ? 0x1b2838 : 0x003791
  };
}
