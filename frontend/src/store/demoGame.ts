import { GameState, Difficulty, Card } from '../types';

// Game emojis for cards
export const CARD_EMOJIS = [
  '🎮', '🕹️', '⚡', '👾', '🎯', '🎲', '🎪', '🎨',
  '🎭', '🎬', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤',
  '🏆', '🏅', '⭐', '💎', '👑', '🔥', '💫', '✨'
];

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate cards for demo mode
export function generateDemoCards(difficulty: Difficulty): Card[] {
  const pairCount = difficulty === Difficulty.Easy ? 4 : difficulty === Difficulty.Medium ? 8 : 12;

  // Select random emojis for this game
  const selectedEmojis = shuffleArray(CARD_EMOJIS).slice(0, pairCount);

  // Create pairs (each emoji appears twice)
  const values: number[] = [];
  for (let i = 0; i < pairCount; i++) {
    values.push(i, i); // Add each value twice for pairs
  }

  // Shuffle the positions
  const shuffledValues = shuffleArray(values);

  // Create card objects
  const cards: Card[] = shuffledValues.map((value, index) => ({
    id: index,
    value,
    is_flipped: false,
    is_matched: false,
    position: index,
  }));

  return cards;
}

// Create initial demo game state
export function createDemoGame(difficulty: Difficulty): GameState {
  const cards = generateDemoCards(difficulty);
  const totalPairs = difficulty === Difficulty.Easy ? 4 : difficulty === Difficulty.Medium ? 8 : 12;
  
  return {
    game_id: Math.floor(Math.random() * 1000000),
    player: 'demo_player',
    difficulty,
    cards,
    flipped_indices: [],
    matched_count: 0,
    total_pairs: totalPairs,
    moves: 0,
    score: 0,
    started_at: Date.now(),
    completed_at: 0,
    status: 0, // Active
    elapsed_time: 0,
  };
}

// Check if two cards match
export function checkCardsMatch(game: GameState, index1: number, index2: number): boolean {
  const card1 = game.cards[index1];
  const card2 = game.cards[index2];
  
  if (!card1 || !card2) return false;
  
  return card1.value === card2.value;
}

// Calculate score
export function calculateScore(game: GameState): number {
  const baseScore = 1000;
  const difficultyMultiplier = game.difficulty === Difficulty.Easy ? 10 : 
                                game.difficulty === Difficulty.Medium ? 15 : 20;
  
  const elapsedSeconds = (Date.now() - game.started_at) / 1000;
  const timeBonus = Math.max(0, 500 - Math.floor(elapsedSeconds * 2));
  
  const optimalMoves = game.total_pairs;
  const extraMoves = Math.max(0, game.moves - optimalMoves);
  const movePenalty = extraMoves * 50;
  
  const score = (baseScore + timeBonus - movePenalty) * difficultyMultiplier;
  
  return Math.max(0, Math.floor(score));
}

