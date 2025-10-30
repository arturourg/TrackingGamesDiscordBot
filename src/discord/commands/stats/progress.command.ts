import { Platform } from '@prisma/client';
import { SlashCommandBuilder } from 'discord.js';

import type { Command } from '../command.types.js';
import { serviceContainer } from '../../../services/service-container.js';
import { GameProgressUseCase } from '../../../services/use-cases/game-progress.use-case.js';
import { buildGameProgressEmbed } from '../../embeds/progress.embed.js';

export const progressCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('progreso')
    .setDescription('Consulta tu progreso en un juego específico')
    .addStringOption((option) =>
      option.setName('juego').setDescription('Nombre o ID del juego').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('platform')
        .setDescription('steam o psn')
        .setChoices(
          { name: 'Steam', value: Platform.steam },
          { name: 'PlayStation', value: Platform.psn }
        )
    ),
  async execute(interaction) {
    const platform = (interaction.options.getString('platform') as Platform | null) ?? Platform.steam;
    const query = interaction.options.getString('juego', true);
    const useCase = serviceContainer.get(GameProgressUseCase);
    const progress = await useCase.execute(interaction.user.id, platform, query);
    await interaction.reply({ embeds: [buildGameProgressEmbed(platform, query, progress)] });
  }
};
