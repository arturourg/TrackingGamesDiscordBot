import { Platform } from '@prisma/client';
import { SlashCommandBuilder } from 'discord.js';

import type { Command } from '../command.types.js';
import { serviceContainer } from '../../../services/service-container.js';
import { PlayedGamesUseCase } from '../../../services/use-cases/played-games.use-case.js';
import { buildPlayedEmbed } from '../../embeds/played.embed.js';

export const playedCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('jugados')
    .setDescription('Lista tus juegos más recientes o más jugados')
    .addStringOption((option) =>
      option
        .setName('platform')
        .setDescription('steam o psn')
        .setChoices(
          { name: 'Steam', value: Platform.steam },
          { name: 'PlayStation', value: Platform.psn }
        )
    )
    .addStringOption((option) =>
      option
        .setName('rango_tiempo')
        .setDescription('7d, 30d o all')
        .setChoices(
          { name: 'Últimos 7 días', value: '7d' },
          { name: 'Últimos 30 días', value: '30d' },
          { name: 'Todo el historial', value: 'all' }
        )
    ),
  async execute(interaction) {
    const platform = (interaction.options.getString('platform') as Platform | null) ?? Platform.steam;
    const range = (interaction.options.getString('rango_tiempo') as '7d' | '30d' | 'all' | null) ?? '30d';
    const useCase = serviceContainer.get(PlayedGamesUseCase);
    const result = await useCase.execute(interaction.user.id, platform, range, 0);
    await interaction.reply({ embeds: [buildPlayedEmbed(platform, result, 0)] });
  }
};
