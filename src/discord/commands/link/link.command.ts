import { SlashCommandBuilder } from 'discord.js';

import type { Command } from '../command.types.js';
import { LinkAccountUseCase } from '../../../services/use-cases/link-account.use-case.js';
import { serviceContainer } from '../../../services/service-container.js';
import { buildLinkSteamEmbed, buildLinkPsnEmbed } from '../../embeds/link.embed.js';

export const linkCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Vincula tu cuenta de Steam o PSN')
    .addSubcommand((sub) =>
      sub
        .setName('steam')
        .setDescription('Vincula tu SteamID o vanity URL')
        .addStringOption((option) =>
          option.setName('id').setDescription('SteamID64 o vanity').setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName('psn').setDescription('Inicia el flujo de vinculación con PlayStation Network')
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const useCase = serviceContainer.get(LinkAccountUseCase);

    if (subcommand === 'steam') {
      const steamInput = interaction.options.getString('id', true);
      const result = await useCase.linkSteam({ discordUserId: interaction.user.id, steamInput });
      await interaction.reply({ embeds: [buildLinkSteamEmbed(result)], ephemeral: true });
      return;
    }

    const authInfo = await useCase.linkPsn({ discordUserId: interaction.user.id });
    await interaction.reply({ embeds: [buildLinkPsnEmbed(authInfo)], ephemeral: true });
  }
};
