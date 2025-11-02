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

export interface DojoConfig {
  worldAddress: string;
  rpcUrl: string;
  toriiUrl?: string;
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