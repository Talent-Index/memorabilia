import { create } from 'zustand';
import { Account } from 'starknet';
import { GameState, Difficulty, Card, PlayerStats, LeaderboardEntry, TelegramUser } from '../types';
import { GameController } from '../dojo/gameController';
import { createDemoGame, checkCardsMatch, calculateScore } from './demoGame';
import { playFlipSound, playMatchSound, playMismatchSound, playVictorySound } from '../utils/sounds';

interface GameStore {
  // User & Account
  telegramUser: TelegramUser | null;
  account: Account | null;
  isAccountLoading: boolean;
  
  // Game State
  currentGame: GameState | null;
  gameController: GameController | null;
  isGameLoading: boolean;
  
  // UI State
  selectedDifficulty: Difficulty | null;
  flippedCards: number[];
  isChecking: boolean;
  showWinModal: boolean;
  
  // Stats & Leaderboard
  playerStats: PlayerStats | null;
  leaderboard: LeaderboardEntry[];
  
  // Actions
  setTelegramUser: (user: TelegramUser | null) => void;
  setAccount: (account: Account | null) => void;
  setGameController: (controller: GameController | null) => void;
  
  // Game Actions
  startNewGame: (difficulty: Difficulty) => Promise<void>;
  flipCard: (index: number) => Promise<void>;
  checkMatch: () => Promise<void>;
  abandonGame: () => Promise<void>;
  resetGame: () => void;
  
  // UI Actions
  setSelectedDifficulty: (difficulty: Difficulty | null) => void;
  setShowWinModal: (show: boolean) => void;
  
  // Stats Actions
  setPlayerStats: (stats: PlayerStats | null) => void;
  setLeaderboard: (entries: LeaderboardEntry[]) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial State
  telegramUser: null,
  account: null,
  isAccountLoading: false,
  
  currentGame: null,
  gameController: null,
  isGameLoading: false,
  
  selectedDifficulty: null,
  flippedCards: [],
  isChecking: false,
  showWinModal: false,
  
  playerStats: null,
  leaderboard: [],
  
  // Setters
  setTelegramUser: (user) => set({ telegramUser: user }),
  setAccount: (account) => set({ account }),
  setGameController: (controller) => set({ gameController: controller }),
  
  // Game Actions
  startNewGame: async (difficulty: Difficulty) => {
    const { gameController } = get();

    set({ isGameLoading: true });

    try {
      // Check if we're in demo mode (no game controller)
      if (!gameController) {
        console.log('🎮 Starting game in DEMO MODE');

        // Create demo game
        const newGame = createDemoGame(difficulty);

        set({
          currentGame: newGame,
          selectedDifficulty: difficulty,
          flippedCards: [],
          isGameLoading: false,
          showWinModal: false,
        });

        return;
      }

      // Blockchain mode
      console.log('⛓️ Starting game on blockchain');
      const gameId = await gameController.startGame(difficulty);

      // Create initial game state
      const newGame: GameState = {
        game_id: gameId,
        player: get().account?.address || '',
        difficulty,
        cards: [],
        flipped_indices: [],
        matched_count: 0,
        total_pairs: difficulty === Difficulty.Easy ? 4 : difficulty === Difficulty.Medium ? 8 : 12,
        moves: 0,
        score: 0,
        started_at: Date.now(),
        completed_at: 0,
        status: 0, // Active
        elapsed_time: 0,
      };

      set({
        currentGame: newGame,
        selectedDifficulty: difficulty,
        flippedCards: [],
        isGameLoading: false,
        showWinModal: false,
      });
    } catch (error) {
      console.error('Failed to start game:', error);
      set({ isGameLoading: false });
    }
  },
  
  flipCard: async (index: number) => {
    const { currentGame, gameController, flippedCards, isChecking } = get();

    if (!currentGame || isChecking) {
      return;
    }

    // Can't flip more than 2 cards
    if (flippedCards.length >= 2) {
      return;
    }

    // Can't flip already flipped card
    if (flippedCards.includes(index)) {
      return;
    }

    // Can't flip matched card
    const card = currentGame.cards[index];
    if (card?.is_matched) {
      return;
    }

    try {
      // Play flip sound
      playFlipSound();

      // Demo mode - just update local state
      if (!gameController) {
        const newFlippedCards = [...flippedCards, index];
        set({ flippedCards: newFlippedCards });

        // If 2 cards are flipped, check for match after a short delay
        if (newFlippedCards.length === 2) {
          setTimeout(() => {
            get().checkMatch();
          }, 600);
        }
        return;
      }

      // Blockchain mode
      await gameController.flipCard(currentGame.game_id, index);

      const newFlippedCards = [...flippedCards, index];
      set({ flippedCards: newFlippedCards });

      // If 2 cards are flipped, check for match
      if (newFlippedCards.length === 2) {
        setTimeout(() => {
          get().checkMatch();
        }, 500);
      }
    } catch (error) {
      console.error('Failed to flip card:', error);
    }
  },
  
  checkMatch: async () => {
    const { currentGame, gameController, flippedCards } = get();

    if (!currentGame || flippedCards.length !== 2) {
      return;
    }

    set({ isChecking: true });

    try {
      let isMatch = false;

      // Demo mode - check match locally
      if (!gameController) {
        isMatch = checkCardsMatch(currentGame, flippedCards[0], flippedCards[1]);
      } else {
        // Blockchain mode
        isMatch = await gameController.checkMatch(currentGame.game_id);
      }

      if (isMatch) {
        // Play match sound
        playMatchSound();

        // Update cards to mark as matched
        const updatedCards = currentGame.cards.map((card, idx) => {
          if (flippedCards.includes(idx)) {
            return { ...card, is_matched: true, is_flipped: true };
          }
          return card;
        });

        // Update matched count
        const newMatchedCount = currentGame.matched_count + 1;
        const newMoves = currentGame.moves + 1;

        // Calculate score
        const score = calculateScore({
          ...currentGame,
          moves: newMoves,
          matched_count: newMatchedCount,
        });

        const updatedGame = {
          ...currentGame,
          cards: updatedCards,
          matched_count: newMatchedCount,
          moves: newMoves,
          score,
        };

        set({
          currentGame: updatedGame,
          flippedCards: [],
          isChecking: false,
        });

        // Check if game is won
        if (newMatchedCount === currentGame.total_pairs) {
          const finalGame = {
            ...updatedGame,
            completed_at: Date.now(),
            status: 1, // Completed
          };

          set({ currentGame: finalGame });

          // Play victory sound
          setTimeout(() => {
            playVictorySound();
            set({ showWinModal: true });
          }, 500);
        }
      } else {
        // Play mismatch sound
        playMismatchSound();

        // Not a match - flip cards back after delay
        setTimeout(() => {
          set({
            flippedCards: [],
            isChecking: false,
            currentGame: {
              ...currentGame,
              moves: currentGame.moves + 1,
            },
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to check match:', error);
      set({ isChecking: false, flippedCards: [] });
    }
  },
  
  abandonGame: async () => {
    const { currentGame, gameController } = get();

    if (!currentGame) {
      return;
    }

    try {
      // Only call blockchain if we have a controller
      if (gameController) {
        await gameController.abandonGame(currentGame.game_id);
      }

      set({
        currentGame: null,
        flippedCards: [],
        selectedDifficulty: null,
      });
    } catch (error) {
      console.error('Failed to abandon game:', error);
    }
  },
  
  resetGame: () => {
    set({
      currentGame: null,
      flippedCards: [],
      selectedDifficulty: null,
      showWinModal: false,
      isChecking: false,
    });
  },
  
  // UI Actions
  setSelectedDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),
  setShowWinModal: (show) => set({ showWinModal: show }),
  
  // Stats Actions
  setPlayerStats: (stats) => set({ playerStats: stats }),
  setLeaderboard: (entries) => set({ leaderboard: entries }),
}));

