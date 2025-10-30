import { SteamService } from './steam.service.js';
import { PsnService } from './psn.service.js';
import { ProgressService } from './progress.service.js';
import { CompareService } from './compare.service.js';
import { SyncService } from './sync.service.js';
import { LinkAccountUseCase } from './use-cases/link-account.use-case.js';
import { TrophySummaryUseCase } from './use-cases/trophy-summary.use-case.js';
import { GameProgressUseCase } from './use-cases/game-progress.use-case.js';
import { PlayedGamesUseCase } from './use-cases/played-games.use-case.js';
import { BacklogUseCase } from './use-cases/backlog.use-case.js';
import { CompareUsersUseCase } from './use-cases/compare-users.use-case.js';
import { ManualSyncUseCase } from './use-cases/manual-sync.use-case.js';
import { AccountRepository } from '../db/repositories/account.repository.js';
import { UserRepository } from '../db/repositories/user.repository.js';
import { GameRepository } from '../db/repositories/game.repository.js';
import { AchievementRepository } from '../db/repositories/achievement.repository.js';
import { UserGameRepository } from '../db/repositories/user-game.repository.js';
import { UserAchievementRepository } from '../db/repositories/user-achievement.repository.js';
import { SyncJobRepository } from '../db/repositories/sync-job.repository.js';
import { SteamAdapter } from '../adapters/http/steam.adapter.js';
import { PsnAdapter } from '../adapters/http/psn.adapter.js';
import { CacheAdapter } from '../adapters/cache.adapter.js';
import { RateLimiterAdapter } from '../adapters/rate-limiter.adapter.js';
import { CryptoAdapter } from '../adapters/crypto-adapter.js';

class ServiceContainer {
  private instances = new Map();

  get<T>(ctor: new (...args: any[]) => T): T {
    if (this.instances.has(ctor)) {
      return this.instances.get(ctor);
    }

    const instance = this.createInstance(ctor);
    this.instances.set(ctor, instance);
    return instance;
  }

  private createInstance<T>(ctor: new (...args: any[]) => T): T {
    switch (ctor) {
      case LinkAccountUseCase:
        return new LinkAccountUseCase(
          this.get(AccountRepository),
          this.get(UserRepository),
          this.get(SteamService),
          this.get(PsnService),
          this.get(CryptoAdapter)
        ) as T;
      case TrophySummaryUseCase:
        return new TrophySummaryUseCase(
          this.get(ProgressService),
          this.get(CacheAdapter)
        ) as T;
      case GameProgressUseCase:
        return new GameProgressUseCase(this.get(ProgressService), this.get(CacheAdapter)) as T;
      case PlayedGamesUseCase:
        return new PlayedGamesUseCase(this.get(ProgressService), this.get(CacheAdapter)) as T;
      case BacklogUseCase:
        return new BacklogUseCase(this.get(ProgressService), this.get(CacheAdapter)) as T;
      case CompareUsersUseCase:
        return new CompareUsersUseCase(
          this.get(CompareService),
          this.get(CacheAdapter)
        ) as T;
      case ManualSyncUseCase:
        return new ManualSyncUseCase(this.get(SyncService)) as T;
      case SteamService:
        return new SteamService(
          this.get(SteamAdapter),
          this.get(GameRepository),
          this.get(UserGameRepository),
          this.get(AchievementRepository)
        ) as T;
      case PsnService:
        return new PsnService(
          this.get(PsnAdapter),
          this.get(GameRepository),
          this.get(UserGameRepository),
          this.get(AchievementRepository)
        ) as T;
      case ProgressService:
        return new ProgressService(
          this.get(GameRepository),
          this.get(UserGameRepository),
          this.get(UserAchievementRepository)
        ) as T;
      case CompareService:
        return new CompareService(this.get(UserGameRepository)) as T;
      case SyncService:
        return new SyncService(
          this.get(AccountRepository),
          this.get(SteamService),
          this.get(PsnService),
          this.get(SyncJobRepository)
        ) as T;
      case AccountRepository:
        return new AccountRepository() as T;
      case UserRepository:
        return new UserRepository() as T;
      case GameRepository:
        return new GameRepository() as T;
      case AchievementRepository:
        return new AchievementRepository() as T;
      case UserGameRepository:
        return new UserGameRepository() as T;
      case UserAchievementRepository:
        return new UserAchievementRepository() as T;
      case SyncJobRepository:
        return new SyncJobRepository() as T;
      case SteamAdapter:
        return new SteamAdapter(this.get(RateLimiterAdapter)) as T;
      case PsnAdapter:
        return new PsnAdapter(this.get(RateLimiterAdapter)) as T;
      case CacheAdapter:
        return new CacheAdapter();
      case RateLimiterAdapter:
        return new RateLimiterAdapter();
      case CryptoAdapter:
        return new CryptoAdapter();
      default:
        throw new Error(`Servicio no registrado: ${ctor.name}`);
    }
  }
}

export const serviceContainer = new ServiceContainer();
