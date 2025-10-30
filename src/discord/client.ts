import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';

import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { metrics } from '../config/metrics.js';

import type { Command } from './commands/command.types.js';
import { commandsRegistry } from './commands/index.js';

const commandCollection = new Collection<string, Command>();

export async function startDiscordBot(): Promise<void> {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds]
  });

  for (const command of commandsRegistry) {
    commandCollection.set(command.data.name, command);
  }

  client.once('ready', async (readyClient) => {
    logger.info({ user: readyClient.user.tag }, 'Bot listo');
    await registerCommands();
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const command = commandCollection.get(interaction.commandName);
    if (!command) {
      logger.warn({ commandName: interaction.commandName }, 'Comando no encontrado');
      return;
    }

    metrics.commandCounter.labels({ command: command.data.name }).inc();

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error({ err: error }, 'Error ejecutando comando');
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          content: 'Ha ocurrido un error inesperado. Intenta nuevamente más tarde.',
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: 'Ha ocurrido un error inesperado. Intenta nuevamente más tarde.',
          ephemeral: true
        });
      }
    }
  });

  await client.login(env.DISCORD_TOKEN);
}

async function registerCommands(): Promise<void> {
  const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);
  await rest.put(Routes.applicationCommands(env.DISCORD_APP_ID), {
    body: commandsRegistry.map((command) => command.data.toJSON())
  });
  logger.info('Comandos registrados globalmente');
}
