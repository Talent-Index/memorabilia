export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export interface SDKConfig {
  telegramBotToken: string;
  dojoWorldAddress: string;
  rpcUrl: string;
  toriiUrl?: string;
  network?: 'katana' | 'sepolia' | 'mainnet';
}

// Minimal Account interface for the prototype
export interface Account {
  address?: string;
  execute: (tx: { contractAddress: string; entrypoint: string; calldata?: any[] }) => Promise<any>;
  callContract?: (opts: any) => Promise<any>;
}

export interface TxReceipt {
  transaction_hash?: string;
  events?: any[];
}
