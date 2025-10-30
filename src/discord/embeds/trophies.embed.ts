import type { APIEmbed } from 'discord.js';

import type { TrophySummaryViewModel } from '../../services/use-cases/trophy-summary.use-case.js';

export function buildTrophiesEmbed(platform: string, summary: TrophySummaryViewModel): APIEmbed {
  const color = platform === 'steam' ? 0x1b2838 : 0x003791;
  const progressBar = buildProgressBar(summary.completionPct);

  return {
    title: `${platform === 'steam' ? '🎮' : '🕹️'} Progreso total`,
    color,
    fields: [
      {
        name: 'Logros obtenidos',
        value: `${summary.earned}/${summary.total} · ${summary.completionPct.toFixed(1)}%`,
        inline: true
      },
      {
        name: 'Barra de progreso',
        value: progressBar,
        inline: true
      },
      {
        name: 'Últimos conseguidos',
        value:
          summary.recent.length > 0
            ? summary.recent
                .map((achievement) => `• ${achievement.name} – ${achievement.earnedAt ?? 'N/D'}`)
                .join('\n')
            : 'Sin logros recientes'
      }
    ]
  };
}

function buildProgressBar(percentage: number): string {
  const totalBlocks = 10;
  const filledBlocks = Math.round((percentage / 100) * totalBlocks);
  return '▰'.repeat(filledBlocks) + '▱'.repeat(totalBlocks - filledBlocks);
}
