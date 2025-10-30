import type { Platform, SyncJob, SyncStatus } from '@prisma/client';

import { prisma } from '../client.js';

export class SyncJobRepository {
  async createJob(data: { userId: string; platform: Platform }): Promise<SyncJob> {
    return prisma.syncJob.create({
      data: { userId: data.userId, platform: data.platform }
    });
  }

  async updateStatus(id: string, status: SyncStatus, error?: string | null): Promise<void> {
    await prisma.syncJob.update({
      where: { id },
      data: {
        status,
        error: error ?? null,
        ...(status === 'running' ? { startedAt: new Date() } : {}),
        ...(status === 'success' || status === 'failed'
          ? { finishedAt: new Date() }
          : {})
      }
    });
  }
}
