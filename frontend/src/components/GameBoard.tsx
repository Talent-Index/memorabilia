import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { GAME_CONFIGS } from '../types';
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
        <div className="mb-6 bg-gradient-to-r from-museum-blue-600 to-museum-bronze-600 rounded-xl p-4 text-center animate-pulse">
          <div className="text-xl font-bold text-white">👀 Memorize the Artifacts!</div>
          <div className="text-sm text-white/80 mt-1">Exhibition starts in a moment...</div>
        </div>
      )}

      {/* Game Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="bg-museum-stone-800/50 backdrop-blur-lg rounded-xl p-4 text-center border border-museum-bronze-400/20">
          <div className="text-3xl font-bold text-museum-blue-400">{currentGame.moves}</div>
          <div className="text-sm text-museum-stone-400">Discoveries</div>
          <div className="text-xs text-museum-stone-500 mt-1">
            Optimal: {config.optimalMoves}
          </div>
        </div>

        <div className="bg-museum-stone-800/50 backdrop-blur-lg rounded-xl p-4 text-center border border-museum-bronze-400/20">
          <div className="text-3xl font-bold text-museum-gold-400">{formatTime(elapsedTime)}</div>
          <div className="text-sm text-museum-stone-400">Time</div>
        </div>

        <div className="bg-museum-stone-800/50 backdrop-blur-lg rounded-xl p-4 text-center border border-museum-bronze-400/20">
          <div className="text-3xl font-bold text-museum-bronze-400">
            {currentGame.matched_count}/{currentGame.total_pairs}
          </div>
          <div className="text-sm text-museum-stone-400">Artifacts</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 bg-museum-stone-800/50 rounded-full h-4 overflow-hidden border border-museum-bronze-400/20">
        <div
          className="h-full bg-gradient-to-r from-museum-blue-500 to-museum-bronze-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Game Board */}
      <div className={`grid ${gridCols} gap-3 sm:gap-4 mb-6`}>
        {currentGame.cards.map((card, index) => {
          const isMatched = card.is_matched;
          // Card is flipped if: preview mode, currently flipped, or matched
          const isFlipped = showPreview || flippedCards.includes(index) || isMatched;
          // Use emojis from game state (era-specific, always provided)
          const emoji = currentGame.emojis?.[card.value];

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
        <div className="text-center text-museum-gold-400 animate-pulse">
          🔍 Examining artifacts...
        </div>
      )}
    </div>
  );
}

