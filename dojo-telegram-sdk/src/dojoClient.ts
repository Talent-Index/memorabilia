import type { Account } from 'starknet';
import { Provider } from 'starknet';
import type { DojoConfig } from './types';

/** Minimal Dojo client wrapper for executing world entrypoints and reads. */
export class DojoClient {
  private worldAddress: string;
  private rpcUrl: string;
  public provider: any;
  private toriiClient: any | null = null;

  constructor(config: DojoConfig) {
    this.worldAddress = config.worldAddress;
    this.rpcUrl = config.rpcUrl;

    // Initialize provider
    try {
      // Provider constructor shape differs across starknet client versions.
      // Use a permissive instantiation; tests will stub provider as needed.
      this.provider = new Provider({ baseUrl: this.rpcUrl } as any);
    } catch {
      // Fallback: provider may not be constructible in test env — leave undefined and allow injection.
      this.provider = undefined;
    }

    // If a Torii URL is provided in the config, attempt to lazy-load the torii client
    // at runtime. This is a soft integration — if the package isn't installed the
    // SDK still works with prototype storage and burner adapters.
    if ((config as any).toriiUrl) {
      (async () => {
        try {
          // @ts-ignore - optional dependency
          const mod = await import('@dojoengine/torii-client');
          const ToriiClient = mod && (mod.ToriiClient || mod.default || mod);
          if (ToriiClient) {
            this.toriiClient = new ToriiClient({ baseUrl: (config as any).toriiUrl });
          }
        } catch (e) {
          // ignore - torii client not available in this environment
        }
      })();
    }
  }

  /** Thin wrapper around Account.execute with optional waitForAcceptance. */
  async executeWithAccount(
    account: Account,
    entrypoint: string,
    calldata: any[] = [],
    options: { waitForAcceptance?: boolean } = { waitForAcceptance: true }
  ): Promise<any> {
    if (!account || typeof account.execute !== 'function') {
      throw new Error('Invalid account provided');
    }

    const tx = await account.execute({
      contractAddress: this.worldAddress,
      entrypoint,
      calldata,
    } as any);

    // try to wait for acceptance using available waiter
    if (options.waitForAcceptance) {
      const txHash =
        tx.transaction_hash ?? (tx as any).hash ?? null;
      if (txHash) {
        if (typeof account.waitForTransaction === 'function') {
          await account.waitForTransaction(txHash);
        } else if (this.provider && typeof this.provider.waitForTransaction === 'function') {
          await this.provider.waitForTransaction(txHash);
        }
      }
    }

    return tx;
  }

  /** Start a game by calling 'start_game' entrypoint on the world contract. */
  async startGame(account: Account, difficulty = 1) {
    return this.executeWithAccount(account, 'start_game', [difficulty.toString()]);
  }

  /** Flip a card in a running game. */
  async flipCard(account: Account, gameId: number, cardIndex: number) {
    return this.executeWithAccount(account, 'flip_card', [
      gameId.toString(),
      cardIndex.toString(),
    ]);
  }

  /** Trigger check_match on the contract. */
  async checkMatch(account: Account, gameId: number) {
    return this.executeWithAccount(account, 'check_match', [gameId.toString()]);
  }

  /** Read-only: fetch game state using provider.callContract - returns raw call result. */
  async getGameState(gameId: number): Promise<any> {
    if (!this.provider || typeof this.provider.callContract !== 'function') {
      throw new Error('Provider not initialized or does not support callContract');
    }

    const res = await this.provider.callContract({
      contractAddress: this.worldAddress,
      entrypoint: 'get_game',
      calldata: [gameId.toString()],
    } as any);

    return res;
  }

  /**
   * Subscribe to game-level events using Torii (if available).
   * Handler will be called with (event) per Torii subscription callbacks.
   */
  subscribeGameEvents(gameId: number, handler: (ev: any) => void) {
    if (!this.toriiClient) {
      throw new Error('Torii client not initialized or not available. Provide @dojoengine/torii-client in dependencies and set toriiUrl in SDK config.');
    }
    // Many torii-client versions provide a `subscribe` or `listen` method - try both.
    if (this.toriiClient.subscribe) return this.toriiClient.subscribe(`game:${gameId}`, handler);
    if (this.toriiClient.listen) return this.toriiClient.listen(`game:${gameId}`, handler);
    throw new Error('Torii client does not expose subscribe/listen API expected by SDK.');
  }

  /** Helper to inject a mock provider in tests or advanced flows. */
  setProvider(providerInstance: any) {
    this.provider = providerInstance;
  }
}
