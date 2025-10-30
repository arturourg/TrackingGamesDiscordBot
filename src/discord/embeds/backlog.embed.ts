import type { APIEmbed } from 'discord.js';

import type { BacklogViewModel } from '../../services/use-cases/backlog.use-case.js';

export function buildBacklogEmbed(platform: string, payload: BacklogViewModel): APIEmbed {
  return {
    title: `${platform === 'steam' ? '🎮' : '🕹️'} Pendientes`,
    description:
      payload.games.length > 0
        ? payload.games
            .map(
              (game) =>
                `• ${game.name} — ${game.completionPct.toFixed(1)}% · ${game.hoursPlayed.toFixed(1)}h`
            )
            .join('\n')
        : 'Nada pendiente, ¡felicitaciones! 🎉',
    color: platform === 'steam' ? 0x1b2838 : 0x003791
  };
}
