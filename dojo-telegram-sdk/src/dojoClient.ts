import { Account } from './types';

export interface DojoClientConfig {
  worldAddress: string;
  rpcUrl: string;
}

/** Minimal Dojo client wrapper for executing world entrypoints. */
export class DojoClient {
  private worldAddress: string;
  private rpcUrl: string;
  private toriiClient: any | null = null;

  constructor(config: DojoClientConfig) {
    this.worldAddress = config.worldAddress;
    this.rpcUrl = config.rpcUrl;
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

  /** Execute a contract entrypoint using a provided account. */
  async executeWithAccount(account: Account, entrypoint: string, calldata: any[] = []) {
    // This is a thin wrapper around Account.execute
    // Real implementations should handle CallData encoding and receipt parsing.
    const tx = await account.execute({
      contractAddress: this.worldAddress,
      entrypoint,
      calldata,
    });
    // Wait or return tx depending on account API
    return tx;
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
}
