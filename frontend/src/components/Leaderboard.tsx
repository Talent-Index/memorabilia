import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { LeaderboardEntry } from '../types';
import { useLeaderboardQuery } from '../hooks/useUserQuery';

interface LeaderboardProps {
  onBack: () => void;
}

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const { leaderboard } = useGameStore();
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const { topPlayers, loading, error, refetch } = useLeaderboardQuery(100);

  // Use store leaderboard if available, otherwise use Torii query
  const displayLeaderboard = leaderboard.length > 0 ? leaderboard : topPlayers;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyBadge = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return <span className="px-2 py-1 bg-museum-bronze-600 rounded text-xs">Ancient</span>;
      case 2:
        return <span className="px-2 py-1 bg-museum-stone-600 rounded text-xs">Medieval</span>;
      case 3:
        return <span className="px-2 py-1 bg-museum-blue-600 rounded text-xs">Modern</span>;
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
          <h2 className="text-4xl font-bold bg-gradient-to-r from-museum-gold-400 to-museum-bronze-500 bg-clip-text text-transparent mb-2">🏆 Hall of Fame</h2>
          <p className="text-museum-stone-400">Top collectors and their finest exhibitions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={refetch}
            disabled={loading}
            className="px-4 py-2 bg-museum-blue-600 hover:bg-museum-blue-700 disabled:opacity-50 rounded-lg font-medium transition-colors"
            title="Refresh leaderboard"
          >
            🔄 Refresh
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-museum-stone-700 hover:bg-museum-stone-600 rounded-xl font-medium transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-600/50 rounded-lg text-red-400">
          ⚠️ Error loading leaderboard: {error}
        </div>
      )}

      {/* Loading State */}
      {loading && displayLeaderboard.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4 animate-bounce">⏳</div>
          <h3 className="text-2xl font-bold mb-2">Loading Leaderboard...</h3>
          <p className="text-museum-stone-400">Fetching top players from the museum...</p>
        </div>
      )}

      {/* Filters - only show when have data */}
      {displayLeaderboard.length > 0 && (
        <div className="flex space-x-2 mb-6">
          {['all', 'easy', 'medium', 'hard'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors capitalize
                ${filter === f
                  ? 'bg-museum-blue-600 text-white'
                  : 'bg-museum-stone-700 text-museum-stone-300 hover:bg-museum-stone-600'
                }
              `}
            >
              {f === 'easy' ? 'Ancient' : f === 'medium' ? 'Medieval' : f === 'hard' ? 'Modern' : f}
            </button>
          ))}
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-museum-stone-800/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-museum-bronze-400/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-museum-stone-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-museum-stone-400">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-museum-stone-400">Collector</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-museum-stone-400">Score</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-museum-stone-400">Era</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-museum-stone-400">Discoveries</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-museum-stone-400">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-museum-stone-700">
              {displayLeaderboard.map((entry) => (
                <tr 
                  key={entry.rank}
                  className="hover:bg-museum-stone-700/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-2xl font-bold">
                      {getRankEmoji(entry.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{entry.telegram_id}</div>
                      <div className="text-xs text-museum-stone-500">{entry.player.slice(0, 10)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xl font-bold text-museum-gold-400">
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
                    <div className="font-medium text-museum-blue-400">
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
          <div className="text-6xl mb-4">🏛️</div>
          <h3 className="text-2xl font-bold mb-2">No Exhibitions Yet</h3>
          <p className="text-museum-stone-400">Be the first to complete a collection and claim the top spot!</p>
        </div>
      )}
    </div>
  );
}

