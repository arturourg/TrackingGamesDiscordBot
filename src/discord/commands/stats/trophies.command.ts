import { Platform } from '@prisma/client';
import { SlashCommandBuilder } from 'discord.js';

import type { Command } from '../command.types.js';
import { serviceContainer } from '../../../services/service-container.js';
import { TrophySummaryUseCase } from '../../../services/use-cases/trophy-summary.use-case.js';
import { buildTrophiesEmbed } from '../../embeds/trophies.embed.js';

export const trophiesCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('trofeos')
    .setDescription('Muestra un resumen de tus trofeos/logros')
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
    const useCase = serviceContainer.get(TrophySummaryUseCase);
    const summary = await useCase.execute(interaction.user.id, platform);
    await interaction.reply({ embeds: [buildTrophiesEmbed(platform, summary)] });
  }
};
