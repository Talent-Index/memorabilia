// Game Types
export interface Card {
  id: number;
  value: number;
  is_flipped: boolean;
  is_matched: boolean;
  position: number;
}

export enum GameStatus {
  Active = 0,
  Won = 1,
  Abandoned = 2,
}

export enum Difficulty {
  Easy = 1,
  Medium = 2,
  Hard = 3,
}

export interface GameState {
  game_id: number;
  player: string;
  difficulty: Difficulty;
  cards: Card[];
  emojis?: string[]; // Emojis for this game (demo mode)
  flipped_indices: number[];
  matched_count: number;
  total_pairs: number;
  moves: number;
  score: number;
  started_at: number;
  completed_at: number;
  status: GameStatus;
  elapsed_time: number;
}

// Account Types
export interface UserAccount {
  telegram_id: string;
  owner_public_key: string;
  session_public_key: string;
  account_address: string;
  created_at: number;
  last_active: number;
  nonce: number;
  total_games: number;
  is_active: boolean;
}

export interface SessionPolicy {
  account_address: string;
  allowed_contracts: string[];
  allowed_methods: string[];
  max_fee: string;
  expires_at: number;
  is_active: boolean;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  player: string;
  telegram_id: string;
  score: number;
  difficulty: Difficulty;
  moves: number;
  time: number;
  game_id: number;
  achieved_at: number;
}

export interface PlayerStats {
  player: string;
  total_games: number;
  total_wins: number;
  best_score: number;
  best_time: number;
  total_moves: number;
  average_score: number;
  games_by_difficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
}

// Telegram Types
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    query_id?: string;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive: boolean) => void;
    hideProgress: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  sendData: (data: string) => void;
  openLink: (url: string) => void;
  openTelegramLink: (url: string) => void;
  showPopup: (params: {
    title?: string;
    message: string;
    buttons?: Array<{ id?: string; type?: string; text?: string }>;
  }, callback?: (buttonId: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

// UI Types
export interface GameConfig {
  difficulty: Difficulty;
  cardCount: number;
  pairCount: number;
  optimalMoves: number;
}

export const GAME_CONFIGS: Record<Difficulty, GameConfig> = {
  [Difficulty.Easy]: {
    difficulty: Difficulty.Easy,
    cardCount: 8,
    pairCount: 4,
    optimalMoves: 8,
  },
  [Difficulty.Medium]: {
    difficulty: Difficulty.Medium,
    cardCount: 16,
    pairCount: 8,
    optimalMoves: 16,
  },
  [Difficulty.Hard]: {
    difficulty: Difficulty.Hard,
    cardCount: 24,
    pairCount: 12,
    optimalMoves: 24,
  },
};

// Star rating calculation
export function calculateStars(moves: number, optimalMoves: number): number {
  const moveRatio = (moves * 100) / optimalMoves;
  
  if (moveRatio <= 110) return 3;
  if (moveRatio <= 150) return 2;
  return 1;
}

// Grade calculation
export function calculateGrade(score: number): string {
  if (score >= 12000) return 'S';
  if (score >= 11000) return 'A';
  if (score >= 10000) return 'B';
  if (score >= 9000) return 'C';
  if (score >= 8000) return 'D';
  return 'F';
}

// Card emoji mapping
export const CARD_EMOJIS = [
  '🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎬', '🎤',
  '🎧', '🎼', '🎹', '🎺', '🎸', '🎻', '🥁', '🎷',
  '🏀', '⚽', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱',
];

export function getCardEmoji(value: number): string {
  return CARD_EMOJIS[value % CARD_EMOJIS.length];
}

