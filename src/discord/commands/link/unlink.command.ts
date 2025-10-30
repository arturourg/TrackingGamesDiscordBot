import { SlashCommandBuilder } from 'discord.js';

import type { Command } from '../command.types.js';

export const unlinkCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('unlink')
    .setDescription('Desvincula una plataforma')
    .addStringOption((option) =>
      option
        .setName('platform')
        .setDescription('steam | psn')
        .setChoices(
          { name: 'Steam', value: 'steam' },
          { name: 'PlayStation', value: 'psn' }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.reply({
      content:
        'Funcionalidad pendiente. Se eliminará la vinculación y los tokens asociados en una iteración futura.',
      ephemeral: true
    });
  }
};
