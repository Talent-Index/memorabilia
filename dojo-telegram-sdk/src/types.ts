export interface TelegramAuth {
  id: number;
  first_name: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

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

export interface DojoConfig {
  worldAddress: string;
  rpcUrl: string;
  toriiUrl?: string;
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

export interface GameState {
  gameId: number;
  status: 'active' | 'completed' | 'abandoned';
  score: number;
  moves: number;
  cards: Card[];
}

export interface Card {
  index: number;
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
}
