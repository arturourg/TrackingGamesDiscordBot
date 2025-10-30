import type { APIEmbed } from 'discord.js';

export function buildHelpEmbed(): APIEmbed {
  return {
    title: 'Tracking Games Bot',
    description:
      'Comienza vinculando tus cuentas con `/link` y consulta tu progreso con `/trofeos`, `/progreso` y más comandos.',
    color: 0x5865f2,
    fields: [
      {
        name: 'Vinculación',
        value: '`/link steam <id>` · `/link psn`',
        inline: false
      },
      {
        name: 'Progreso',
        value: '`/trofeos` · `/progreso juego:<nombre>` · `/jugados` · `/pendientes`',
        inline: false
      },
      {
        name: 'Comparación y Sync',
        value: '`/comparar usuario:@amigo [juego]` · `/sync`',
        inline: false
      }
    ],
    footer: {
      text: 'Utiliza /sync para forzar una actualización si ves datos desactualizados.'
    }
  };
}
