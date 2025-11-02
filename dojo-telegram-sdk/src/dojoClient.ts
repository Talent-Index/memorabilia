import type { Account } from 'starknet';

export interface DojoClientConfig {
  worldAddress: string;
  rpcUrl: string;
}

/** Minimal Dojo client wrapper for executing world entrypoints. */
export class DojoClient {
  private worldAddress: string;
  private rpcUrl: string;

  constructor(config: DojoClientConfig) {
    this.worldAddress = config.worldAddress;
    this.rpcUrl = config.rpcUrl;
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
}
