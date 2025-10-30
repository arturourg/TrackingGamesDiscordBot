import { Platform } from '@prisma/client';
import { SlashCommandBuilder } from 'discord.js';

import type { Command } from '../command.types.js';
import { serviceContainer } from '../../../services/service-container.js';
import { CompareUsersUseCase } from '../../../services/use-cases/compare-users.use-case.js';
import { buildCompareEmbed } from '../../embeds/compare.embed.js';

export const compareCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('comparar')
    .setDescription('Compara tu progreso con otro usuario')
    .addUserOption((option) =>
      option.setName('usuario').setDescription('Usuario a comparar').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('juego').setDescription('ID del juego').setRequired(true)
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
    const gameId = interaction.options.getString('juego', true);
    const targetUser = interaction.options.getUser('usuario', true);
    const useCase = serviceContainer.get(CompareUsersUseCase);
    const payload = await useCase.execute(gameId, platform, [interaction.user.id, targetUser.id]);
    await interaction.reply({ embeds: [buildCompareEmbed(platform, gameId, payload)] });
  }
};
