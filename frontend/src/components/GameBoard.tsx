import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { GAME_CONFIGS } from '../types';
import { CARD_EMOJIS } from '../store/demoGame';
import Card from './Card';

export default function GameBoard() {
  const { currentGame, flippedCards, flipCard, isChecking } = useGameStore();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showPreview, setShowPreview] = useState(true);

  // Show preview when game starts
  useEffect(() => {
    if (!currentGame) return;

    // Show preview for 1.5 seconds
    setShowPreview(true);
    const timer = setTimeout(() => {
      setShowPreview(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentGame?.game_id]);

  // Timer
  useEffect(() => {
    if (!currentGame || currentGame.status !== 0 || showPreview) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - currentGame.started_at) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentGame, showPreview]);

  if (!currentGame || !currentGame.cards || currentGame.cards.length === 0) return null;

  const config = GAME_CONFIGS[currentGame.difficulty];
  const progress = (currentGame.matched_count / currentGame.total_pairs) * 100;

  // Grid layout based on difficulty
  const gridCols = config.cardCount === 8
    ? 'grid-cols-4'
    : config.cardCount === 16
    ? 'grid-cols-4'
    : 'grid-cols-6';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Preview Message */}
      {showPreview && (
        <div className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-center animate-pulse">
          <div className="text-xl font-bold text-white">👀 Memorize the cards!</div>
          <div className="text-sm text-white/80 mt-1">Game starts in a moment...</div>
        </div>
      )}

      {/* Game Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-400">{currentGame.moves}</div>
          <div className="text-sm text-gray-400">Moves</div>
          <div className="text-xs text-gray-500 mt-1">
            Optimal: {config.optimalMoves}
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{formatTime(elapsedTime)}</div>
          <div className="text-sm text-gray-400">Time</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-purple-400">
            {currentGame.matched_count}/{currentGame.total_pairs}
          </div>
          <div className="text-sm text-gray-400">Pairs</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 bg-gray-800/50 rounded-full h-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Game Board */}
      <div className={`grid ${gridCols} gap-3 sm:gap-4 mb-6`}>
        {currentGame.cards.map((card, index) => {
          const isMatched = card.is_matched;
          // Card is flipped if: preview mode, currently flipped, or matched
          const isFlipped = showPreview || flippedCards.includes(index) || isMatched;
          // Use emojis from game state (demo mode) or fallback to CARD_EMOJIS
          const emoji = currentGame.emojis?.[card.value] || CARD_EMOJIS[card.value];

          return (
            <Card
              key={card.id}
              emoji={emoji}
              isFlipped={isFlipped}
              isMatched={isMatched}
              onClick={() => !isChecking && !showPreview && flipCard(index)}
              disabled={isChecking || isMatched || showPreview}
            />
          );
        })}
      </div>

      {/* Hints */}
      {isChecking && (
        <div className="text-center text-yellow-400 animate-pulse">
          🔍 Checking match...
        </div>
      )}
    </div>
  );
}

