import { Platform } from '@prisma/client';

import { AccountRepository } from '../db/repositories/account.repository.js';
import { SyncJobRepository } from '../db/repositories/sync-job.repository.js';
import { PsnService } from './psn.service.js';
import { SteamService } from './steam.service.js';

export class SyncService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly steamService: SteamService,
    private readonly psnService: PsnService,
    private readonly syncJobRepository: SyncJobRepository
  ) {}

  async enqueueManualSync(userId: string, platform: Platform): Promise<void> {
    await this.syncJobRepository.createJob({ userId, platform });
    // Integración con colas BullMQ pendiente.
  }
}
