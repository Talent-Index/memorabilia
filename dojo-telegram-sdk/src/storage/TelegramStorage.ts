/**
 * Minimal in-memory storage for SDK prototype.
 * In production, use Telegram cloud storage, secure backend, or encrypted storage.
 */
export class TelegramStorage {
  private map: Map<string, any> = new Map();

  async get(key: string): Promise<any | null> {
    return this.map.has(key) ? this.map.get(key) : null;
  }

  async set(key: string, value: any): Promise<void> {
    this.map.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.map.delete(key);
  }
}
