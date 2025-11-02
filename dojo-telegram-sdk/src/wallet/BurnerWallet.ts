import { Account } from '../types';
import { TelegramStorage } from '../storage/TelegramStorage';

export interface BurnerWalletOptions {
  externalAccount?: Account | null;
}

/**
 * Prototype BurnerWallet: stores a fake account object in memory.
 * Replace with @dojoengine/create-burner integration in production.
 */
export class BurnerWallet {
  private storage: TelegramStorage;
  private externalAccount?: Account | null;

  constructor(opts?: BurnerWalletOptions) {
    this.storage = new TelegramStorage();
    this.externalAccount = opts?.externalAccount;
  }

  async getOrCreate(telegramUserId: number): Promise<Account> {
    // If an external burner account was injected, return it.
    if (this.externalAccount) return this.externalAccount as Account;

    const key = `wallet_${telegramUserId}`;
    const stored = await this.storage.get(key);
    if (stored) return stored as Account;

    // Create a minimal mock account with an execute method
    const mockAccount: Account = {
      address: `0xDEMO_${telegramUserId}`,
      execute: async (tx) => {
        // Return a mocked tx receipt
        return { transaction_hash: '0xDEMO_TX_HASH', events: [] };
      },
    };

    await this.storage.set(key, mockAccount);
    return mockAccount;
  }

  async setupSessionKeys(): Promise<void> {
    // no-op in prototype or when using an external burner manager
    return;
  }
}
