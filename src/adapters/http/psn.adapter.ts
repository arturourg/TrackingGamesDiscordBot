import axios from 'axios';

import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { metrics } from '../../config/metrics.js';
import { RateLimiterAdapter } from '../rate-limiter.adapter.js';

export interface PsnTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export class PsnAdapter {
  private readonly client = axios.create({
    baseURL: 'https://ca.account.sony.com/api',
    timeout: 10_000
  });

  constructor(private readonly rateLimiter: RateLimiterAdapter) {}

  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: env.PSN_CLIENT_ID ?? '',
      redirect_uri: env.PSN_REDIRECT_URI ?? '',
      scope: 'psn:trophy.list psn:trophy.summary',
      state,
      prompt: 'login'
    });
    return `https://ca.account.sony.com/api/authz/v3/oauth/authorize?${params.toString()}`;
  }

  async exchangeCode(code: string, verifier: string): Promise<PsnTokenResponse> {
    return this.rateLimiter.schedulePsn(async () => {
      const response = await this.client.post<PsnTokenResponse>(
        '/authz/v3/oauth/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          code_verifier: verifier,
          redirect_uri: env.PSN_REDIRECT_URI ?? '',
          client_id: env.PSN_CLIENT_ID ?? '',
          client_secret: env.PSN_CLIENT_SECRET ?? ''
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );
      return response.data;
    });
  }

  async refreshToken(refreshToken: string): Promise<PsnTokenResponse> {
    return this.rateLimiter.schedulePsn(async () => {
      const response = await this.client.post<PsnTokenResponse>(
        '/authz/v3/oauth/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: env.PSN_CLIENT_ID ?? '',
          client_secret: env.PSN_CLIENT_SECRET ?? ''
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );
      return response.data;
    });
  }

  async getTitles(accessToken: string): Promise<unknown> {
    const http = axios.create({
      baseURL: 'https://m.np.playstation.net/api/trophy/v1',
      timeout: 10_000
    });

    return this.rateLimiter.schedulePsn(async () => {
      const end = metrics.apiRequestDuration.startTimer({ service: 'psn', status: 'pending' });
      try {
        const response = await http.get('/users/me/titles', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        end({ status: response.status.toString() });
        return response.data;
      } catch (error) {
        logger.error({ err: error }, 'Error PSN API');
        end({ status: 'error' });
        throw error;
      }
    });
  }
}
