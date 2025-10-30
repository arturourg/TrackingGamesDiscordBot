import { Platform } from '@prisma/client';

import { SyncService } from '../sync.service.js';

export class ManualSyncUseCase {
  constructor(private readonly syncService: SyncService) {}

  async execute(userId: string, platform: Platform): Promise<void> {
    await this.syncService.enqueueManualSync(userId, platform);
  }
}
