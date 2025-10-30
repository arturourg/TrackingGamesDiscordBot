import { SteamAdapter } from '../adapters/http/steam.adapter.js';
import { AchievementRepository } from '../db/repositories/achievement.repository.js';
import { GameRepository } from '../db/repositories/game.repository.js';
import { UserGameRepository } from '../db/repositories/user-game.repository.js';

export interface SteamSyncResult {
  gamesSynced: number;
}

export class SteamService {
  constructor(
    private readonly adapter: SteamAdapter,
    private readonly gameRepository: GameRepository,
    private readonly userGameRepository: UserGameRepository,
    private readonly achievementRepository: AchievementRepository
  ) {}

  async resolveSteamId(input: string): Promise<string> {
    if (/^\d+$/.test(input)) {
      return input;
    }

    const steamId = await this.adapter.resolveVanityUrl(input);
    if (!steamId) {
      throw new Error('No se pudo resolver el vanity URL de Steam');
    }
    return steamId;
  }

  async syncUserGames(_userId: string, _steamId: string): Promise<SteamSyncResult> {
    // Implementación pendiente: sincronización real con Steam API.
    return { gamesSynced: 0 };
  }
}
