import { Platform } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import { ProgressService } from '../../services/progress.service.js';

describe('ProgressService', () => {
  it('devuelve resumen vacío por defecto', async () => {
    const service = new ProgressService(
      // @ts-expect-error mocks parciales para pruebas
      { findByPlatformAndName: async () => [] },
      // @ts-expect-error mocks parciales para pruebas
      { findPlayedGames: async () => [], findBacklog: async () => [], findByUsersAndGame: async () => [] },
      // @ts-expect-error mocks parciales para pruebas
      { upsertMany: async () => {} }
    );

    const result = await service.getTrophySummary('user', Platform.steam);
    expect(result).toEqual({ earned: 0, total: 0, completionPct: 0, recent: [] });
  });
});
