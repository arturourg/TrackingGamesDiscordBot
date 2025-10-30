import { Platform } from '@prisma/client';
import crypto from 'node:crypto';

import { AccountRepository } from '../../db/repositories/account.repository.js';
import { UserRepository } from '../../db/repositories/user.repository.js';
import { CryptoAdapter } from '../../adapters/crypto-adapter.js';
import { PsnService } from '../psn.service.js';
import { SteamService } from '../steam.service.js';

interface LinkSteamInput {
  discordUserId: string;
  steamInput: string;
}

interface LinkSteamResult {
  steamId: string;
}

interface LinkPsnInput {
  discordUserId: string;
}

interface LinkPsnResult {
  authorizationUrl: string;
  state: string;
}

export class LinkAccountUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly userRepository: UserRepository,
    private readonly steamService: SteamService,
    private readonly psnService: PsnService,
    private readonly cryptoAdapter: CryptoAdapter
  ) {}

  async linkSteam(input: LinkSteamInput): Promise<LinkSteamResult> {
    const user = await this.userRepository.findOrCreate(input.discordUserId);
    const steamId = await this.steamService.resolveSteamId(input.steamInput);
    const encrypted = this.cryptoAdapter.encrypt(JSON.stringify({ steamId }));
    await this.accountRepository.upsertAccount({
      userId: user.id,
      platform: Platform.steam,
      externalId: steamId,
      displayName: steamId,
      tokensEncrypted: encrypted
    });
    return { steamId };
  }

  async linkPsn(input: LinkPsnInput): Promise<LinkPsnResult> {
    const user = await this.userRepository.findOrCreate(input.discordUserId);
    const state = crypto.randomBytes(12).toString('hex');
    const authorizationUrl = await this.psnService.createAuthorizationUrl(state);
    const encrypted = this.cryptoAdapter.encrypt('{}');
    await this.accountRepository.upsertAccount({
      userId: user.id,
      platform: Platform.psn,
      externalId: state,
      displayName: 'PSN Pending',
      tokensEncrypted: encrypted
    });
    return { authorizationUrl, state };
  }
}
