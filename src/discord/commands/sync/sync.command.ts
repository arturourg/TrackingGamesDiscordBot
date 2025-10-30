import { Platform } from '@prisma/client';
import { SlashCommandBuilder } from 'discord.js';

import type { Command } from '../command.types.js';
import { serviceContainer } from '../../../services/service-container.js';
import { ManualSyncUseCase } from '../../../services/use-cases/manual-sync.use-case.js';

export const syncCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('sync')
    .setDescription('Fuerza una sincronización manual con Steam o PSN')
    .addStringOption((option) =>
      option
        .setName('platform')
        .setDescription('steam o psn')
        .setChoices(
          { name: 'Steam', value: Platform.steam },
          { name: 'PlayStation', value: Platform.psn }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const platform = interaction.options.getString('platform', true) as Platform;
    const useCase = serviceContainer.get(ManualSyncUseCase);
    await useCase.execute(interaction.user.id, platform);
    await interaction.reply({
      content: 'Sincronización encolada correctamente. Te avisaremos cuando finalice.',
      ephemeral: true
    });
  }
};
