/** Minimal Telegram initData validation & parsing helper (prototype). */
import { createHash, createHmac } from 'crypto';
import type { TelegramUser } from './types';

export interface TelegramAuth {
  id: string | number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string | number;
  hash: string;
}

export function parseInitData(initData: string): TelegramUser | null {
  try {
    const params = new URLSearchParams(initData);
    const userJson = params.get('user');
    if (!userJson) return null;
    const user = JSON.parse(userJson);
    return {
      id: Number(user.id),
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
    };
  } catch (err) {
    // Lightweight prototype: don't throw
    // eslint-disable-next-line no-console
    console.warn('Failed to parse initData', err);
    return null;
  }
}

export class TelegramAuthenticator {
  private botToken: string;

  constructor(botToken: string) {
    this.botToken = botToken;
  }

  /**
   * Validate Telegram login auth packet.
   * Implements Telegram recommended check:
   * secret_key = SHA256(bot_token)  (raw bytes)
   * expected_hash = HMAC_SHA256(check_string, secret_key).hex()
   */
  validateAuth(auth: TelegramAuth): boolean {
    if (!auth || !auth.hash) return false;
    const checkString = this.buildCheckString(auth);
    const secretKey = createHash('sha256').update(this.botToken).digest();
    const expectedHash = createHmac('sha256', secretKey)
      .update(checkString)
      .digest('hex');
    return expectedHash === auth.hash;
  }

  private buildCheckString(auth: TelegramAuth): string {
    const entries = Object.entries(auth)
      .filter(([k]) => k !== 'hash')
      .map(([k, v]) => [k, String(v)] as [string, string])
      .sort((a, b) => (a[0] < b[0] ? -1 : 1));
    return entries.map(([k, v]) => `${k}=${v}`).join('\n');
  }
}
