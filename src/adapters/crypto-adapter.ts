import { decrypt, encrypt } from '../config/crypto.js';

export class CryptoAdapter {
  encrypt(text: string): Buffer {
    return Buffer.from(JSON.stringify(encrypt(text)), 'utf8');
  }

  decrypt(buffer: Buffer): string {
    const payload = JSON.parse(buffer.toString('utf8')) as ReturnType<typeof encrypt>;
    return decrypt(payload);
  }
}
