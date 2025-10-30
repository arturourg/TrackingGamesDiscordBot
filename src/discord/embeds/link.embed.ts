import type { APIEmbed } from 'discord.js';

interface SteamLinkPayload {
  steamId: string;
}

interface PsnLinkPayload {
  authorizationUrl: string;
  state: string;
}

export function buildLinkSteamEmbed(payload: SteamLinkPayload): APIEmbed {
  return {
    title: '✅ Cuenta de Steam vinculada',
    description: `SteamID asociado: **${payload.steamId}**`,
    color: 0x1b2838
  };
}

export function buildLinkPsnEmbed(payload: PsnLinkPayload): APIEmbed {
  return {
    title: '🔗 Vincula tu cuenta de PlayStation Network',
    description: `Haz clic en [Autorizar PSN](${payload.authorizationUrl}) para completar el proceso.`,
    color: 0x003791,
    footer: { text: `Código de estado: ${payload.state}` }
  };
}
