import crypto from 'node:crypto';

import { env } from './env.js';

const key = Buffer.from(env.TOKEN_ENCRYPTION_KEY.slice(0, 32));

export interface CipherPayload {
  iv: string;
  content: string;
  authTag: string;
}

export function encrypt(text: string): CipherPayload {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    iv: iv.toString('base64'),
    content: encrypted.toString('base64'),
    authTag: authTag.toString('base64')
  };
}

export function decrypt(payload: CipherPayload): string {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(payload.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(payload.authTag, 'base64'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.content, 'base64')),
    decipher.final()
  ]);
  return decrypted.toString('utf8');
}
