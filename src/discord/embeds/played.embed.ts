import type { APIEmbed } from 'discord.js';

import type { PlayedGamesViewModel } from '../../services/use-cases/played-games.use-case.js';

export function buildPlayedEmbed(
  platform: string,
  payload: PlayedGamesViewModel,
  page: number
): APIEmbed {
  return {
    title: `${platform === 'steam' ? '🎮' : '🕹️'} Juegos jugados`,
    description:
      payload.games.length > 0
        ? payload.games
            .map(
              (game, index) =>
                `**${index + 1 + page * payload.games.length}. ${game.name}** — ${game.hoursPlayed.toFixed(
                  1
                )}h`
            )
            .join('\n')
        : 'Sin partidas registradas en el periodo seleccionado.',
    color: platform === 'steam' ? 0x1b2838 : 0x003791,
    footer: { text: `Página ${page + 1}` }
  };
}
