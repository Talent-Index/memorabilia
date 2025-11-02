import { describe, it, expect } from 'vitest';
import { parseInitData, TelegramAuthenticator, TelegramAuth } from '../src/auth';
import { createHash, createHmac } from 'crypto';

describe('auth utilities', () => {
  it('parseInitData returns a user object from initData string', () => {
    const user = { id: 42, first_name: 'Alice', username: 'alice' };
    const params = new URLSearchParams({ user: JSON.stringify(user) }).toString();
    const parsed = parseInitData(params);
    expect(parsed).toEqual({
      id: 42,
      first_name: 'Alice',
      last_name: undefined,
      username: 'alice',
    });
  });

  it('TelegramAuthenticator.validateAuth returns true for valid hash', () => {
    const botToken = 'test-bot-token';
    const authPartial = {
      id: '123',
      first_name: 'Bob',
      auth_date: '1700000000',
    } as any as TelegramAuth;

    // build check string same as implementation
    const entries = Object.entries(authPartial)
      .map(([k, v]) => [k, String(v)] as [string, string])
      .sort((a, b) => (a[0] < b[0] ? -1 : 1));
    const checkString = entries.map(([k, v]) => `${k}=${v}`).join('\n');

    const secretKey = createHash('sha256').update(botToken).digest();
    const expectedHash = createHmac('sha256', secretKey).update(checkString).digest('hex');

    const authPacket: TelegramAuth = { ...authPartial, hash: expectedHash };

    const validator = new TelegramAuthenticator(botToken);
    const ok = validator.validateAuth(authPacket);
    expect(ok).toBe(true);
  });

  it('validateAuth returns false for tampered data', () => {
    const botToken = 'test-bot-token';
    const auth = {
      id: '123',
      first_name: 'Bob',
      auth_date: '1700000000',
      hash: 'deadbeef',
    } as TelegramAuth;

    const validator = new TelegramAuthenticator(botToken);
    expect(validator.validateAuth(auth)).toBe(false);
  });
});
