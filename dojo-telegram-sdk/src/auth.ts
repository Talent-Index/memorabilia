/**
 * Minimal Telegram initData validation & parsing helper (prototype).
 * For production follow Telegram's recommended server-side validation.
 */
export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export function parseInitData(initData: string): TelegramUser | null {
  try {
    // This prototype simply parses URLSearchParams and returns a minimal user object.
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
    console.warn('Failed to parse initData', err);
    return null;
  }
}
