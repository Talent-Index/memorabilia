import { TelegramUser, SDKConfig } from './types';

/**
 * Minimal Telegram auth helper. Production must validate initData server-side.
 */
export class TelegramAuth {
  private botToken: string;

  constructor(botToken: string) {
    this.botToken = botToken;
  }

  /**
   * Prototype authenticate: in a real Mini App this would validate initData
   * and return authenticated user info. Here we return a mock or parsed user.
   */
  async authenticate(initData?: string): Promise<TelegramUser> {
    if (initData) {
      try {
        const params = new URLSearchParams(initData);
        const userJson = params.get('user');
        if (userJson) {
          const u = JSON.parse(userJson);
          return { id: Number(u.id), first_name: u.first_name, last_name: u.last_name, username: u.username };
        }
      } catch (e) {
        // fall through to mock
      }
    }

    // Mock user for development
    return {
      id: 123456789,
      first_name: 'Demo',
      last_name: 'User',
      username: 'demo_user',
    };
  }
}
