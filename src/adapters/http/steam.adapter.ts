import axios from 'axios';

import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { metrics } from '../../config/metrics.js';
import { RateLimiterAdapter } from '../rate-limiter.adapter.js';

type SteamResponse<T> = { response: T };

export class SteamAdapter {
  private readonly client = axios.create({
    baseURL: 'https://api.steampowered.com',
    timeout: 10_000
  });

  constructor(private readonly rateLimiter: RateLimiterAdapter) {}

  async resolveVanityUrl(vanity: string): Promise<string | null> {
    const result = await this.callApi<SteamResponse<{ success: number; steamid?: string }>>(
      '/ISteamUser/ResolveVanityURL/v1/',
      { vanityurl: vanity }
    );
    return result.response.success === 1 ? result.response.steamid ?? null : null;
  }

  async getOwnedGames(steamId: string): Promise<unknown> {
    return this.callApi('/IPlayerService/GetOwnedGames/v1/', {
      steamid: steamId,
      include_appinfo: 1,
      include_played_free_games: 1
    });
  }

  async getPlayerAchievements(steamId: string, appId: string): Promise<unknown> {
    return this.callApi('/ISteamUserStats/GetPlayerAchievements/v1/', {
      steamid: steamId,
      appid: appId
    });
  }

  private async callApi<T>(endpoint: string, params: Record<string, unknown>): Promise<T> {
    return this.rateLimiter.scheduleSteam(async () => {
      const end = metrics.apiRequestDuration.startTimer({ service: 'steam', status: 'pending' });
      try {
        const response = await this.client.get<T>(endpoint, {
          params: { ...params, key: env.STEAM_API_KEY }
        });
        end({ status: response.status.toString() });
        return response.data;
      } catch (error) {
        logger.error({ err: error }, 'Error Steam API');
        end({ status: 'error' });
        throw error;
      }
    });
  }
}
