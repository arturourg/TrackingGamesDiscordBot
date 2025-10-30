import { SlashCommandBuilder } from 'discord.js';

import type { Command } from '../command.types.js';
import { buildHelpEmbed } from '../../embeds/help.embed.js';

export const helpCommand: Command = {
  data: new SlashCommandBuilder().setName('help').setDescription('Guía de comandos del bot'),
  async execute(interaction) {
    await interaction.reply({ embeds: [buildHelpEmbed()], ephemeral: true });
  }
};
