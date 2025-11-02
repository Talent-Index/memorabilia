import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Difficulty, GAME_CONFIGS } from '../types';
import { hapticImpact } from '../telegram/telegram';

interface DifficultySelectorProps {
  onStart: () => void;
}

export default function DifficultySelector({ onStart }: DifficultySelectorProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const { startNewGame, isGameLoading } = useGameStore();

  const handleSelectDifficulty = (difficulty: Difficulty) => {
    hapticImpact('light');
    setSelectedDifficulty(difficulty);
  };

  const handleStart = async () => {
    if (!selectedDifficulty || isGameLoading) return;
    
    hapticImpact('medium');
    await startNewGame(selectedDifficulty);
    onStart();
  };

  const difficulties = [
    {
      level: Difficulty.Easy,
      name: 'Easy',
      emoji: '😊',
      color: 'from-green-500 to-emerald-600',
      borderColor: 'border-green-500',
      description: '4 pairs • 8 cards',
    },
    {
      level: Difficulty.Medium,
      name: 'Medium',
      emoji: '🤔',
      color: 'from-yellow-500 to-orange-600',
      borderColor: 'border-yellow-500',
      description: '8 pairs • 16 cards',
    },
    {
      level: Difficulty.Hard,
      name: 'Hard',
      emoji: '😰',
      color: 'from-red-500 to-pink-600',
      borderColor: 'border-red-500',
      description: '12 pairs • 24 cards',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Choose Your Challenge</h2>
        <p className="text-gray-400">Select a difficulty level to start playing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {difficulties.map((diff) => {
          const config = GAME_CONFIGS[diff.level];
          const isSelected = selectedDifficulty === diff.level;

          return (
            <button
              key={diff.level}
              onClick={() => handleSelectDifficulty(diff.level)}
              className={`
                relative p-6 rounded-2xl transition-all duration-300 transform
                ${isSelected 
                  ? `scale-105 border-4 ${diff.borderColor} shadow-2xl` 
                  : 'border-2 border-gray-700 hover:scale-105 hover:border-gray-600'
                }
                bg-gradient-to-br ${diff.color} bg-opacity-10
              `}
            >
              {/* Emoji */}
              <div className="text-6xl mb-4">{diff.emoji}</div>
              
              {/* Name */}
              <h3 className="text-2xl font-bold mb-2">{diff.name}</h3>
              
              {/* Description */}
              <p className="text-sm text-gray-300 mb-4">{diff.description}</p>
              
              {/* Stats */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Optimal Moves:</span>
                  <span className="font-bold">{config.optimalMoves}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Difficulty:</span>
                  <span className="font-bold">{diff.name}</span>
                </div>
              </div>
              
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Start Button */}
      <div className="text-center">
        <button
          onClick={handleStart}
          disabled={!selectedDifficulty || isGameLoading}
          className={`
            px-12 py-4 rounded-xl text-xl font-bold transition-all duration-300 transform
            ${selectedDifficulty && !isGameLoading
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg'
              : 'bg-gray-700 cursor-not-allowed opacity-50'
            }
          `}
        >
          {isGameLoading ? (
            <span className="flex items-center space-x-2">
              <span className="animate-spin">⏳</span>
              <span>Starting Game...</span>
            </span>
          ) : (
            'Start Game'
          )}
        </button>
      </div>

      {/* How to Play */}
      <div className="mt-12 p-6 bg-gray-800/50 rounded-xl">
        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <span>📖</span>
          <span>How to Play</span>
        </h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start space-x-2">
            <span className="text-blue-400">1.</span>
            <span>Click on cards to flip them and reveal their values</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-400">2.</span>
            <span>Find matching pairs by remembering card positions</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-400">3.</span>
            <span>Match all pairs in the fewest moves to get a high score</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-400">4.</span>
            <span>Compete on the leaderboard for the best scores!</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

