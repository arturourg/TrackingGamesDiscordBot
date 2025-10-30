import { Platform } from '@prisma/client';
import { SlashCommandBuilder } from 'discord.js';

import type { Command } from '../command.types.js';
import { serviceContainer } from '../../../services/service-container.js';
import { BacklogUseCase } from '../../../services/use-cases/backlog.use-case.js';
import { buildBacklogEmbed } from '../../embeds/backlog.embed.js';

export const backlogCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('pendientes')
    .setDescription('Muestra juegos con progreso incompleto')
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
    const useCase = serviceContainer.get(BacklogUseCase);
    const result = await useCase.execute(interaction.user.id, platform);
    await interaction.reply({ embeds: [buildBacklogEmbed(platform, result)] });
  }
};
