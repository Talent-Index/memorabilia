import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  onBack: () => void;
}

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const { leaderboard } = useGameStore();
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Mock leaderboard data for demo
  const mockLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      player: '0x123...abc',
      telegram_id: '@alice',
      score: 12500,
      difficulty: 3,
      moves: 25,
      time: 180,
      game_id: 1,
      achieved_at: Date.now() - 86400000,
    },
    {
      rank: 2,
      player: '0x456...def',
      telegram_id: '@bob',
      score: 12200,
      difficulty: 3,
      moves: 27,
      time: 195,
      game_id: 2,
      achieved_at: Date.now() - 172800000,
    },
    {
      rank: 3,
      player: '0x789...ghi',
      telegram_id: '@charlie',
      score: 11800,
      difficulty: 2,
      moves: 18,
      time: 120,
      game_id: 3,
      achieved_at: Date.now() - 259200000,
    },
  ];

  const displayLeaderboard = leaderboard.length > 0 ? leaderboard : mockLeaderboard;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyBadge = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return <span className="px-2 py-1 bg-green-600 rounded text-xs">Easy</span>;
      case 2:
        return <span className="px-2 py-1 bg-yellow-600 rounded text-xs">Medium</span>;
      case 3:
        return <span className="px-2 py-1 bg-red-600 rounded text-xs">Hard</span>;
      default:
        return null;
    }
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold gradient-text mb-2">🏆 Leaderboard</h2>
          <p className="text-gray-400">Top players and their best scores</p>
        </div>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6">
        {['all', 'easy', 'medium', 'hard'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as typeof filter)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors capitalize
              ${filter === f 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }
            `}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Player</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Score</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Difficulty</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Moves</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {displayLeaderboard.map((entry) => (
                <tr 
                  key={entry.rank}
                  className="hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-2xl font-bold">
                      {getRankEmoji(entry.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{entry.telegram_id}</div>
                      <div className="text-xs text-gray-500">{entry.player.slice(0, 10)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xl font-bold text-yellow-400">
                      {entry.score.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getDifficultyBadge(entry.difficulty)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{entry.moves}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-blue-400">
                      {formatTime(entry.time)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {displayLeaderboard.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold mb-2">No Entries Yet</h3>
          <p className="text-gray-400">Be the first to complete a game and claim the top spot!</p>
        </div>
      )}
    </div>
  );
}

