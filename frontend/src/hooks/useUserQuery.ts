import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { UserAccount, LeaderboardEntry, PlayerStats } from '../types';
import {
  queryUserAccounts,
  queryLeaderboard,
  queryPlayerStats,
  queryActiveUsers,
  getLeaderboardStats,
  ToriiQueryOptions,
} from '../dojo/toriiClient';

interface UseUserQueryResult {
  allUsers: UserAccount[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseLeaderboardResult {
  topPlayers: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UsePlayerStatsResult {
  playerStats: Map<string, PlayerStats>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch all registered users from the Dojo world
 */
export const useUserQuery = (): UseUserQueryResult => {
  const [allUsers, setAllUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const users = await queryUserAccounts({ limit: 1000 });
      setAllUsers(users as UserAccount[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('User query error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    allUsers,
    loading,
    error,
    refetch: fetchUsers,
  };
};

/**
 * Hook to fetch top players from leaderboard
 */
export const useLeaderboardQuery = (limit: number = 100): UseLeaderboardResult => {
  const [topPlayers, setTopPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const entries = await queryLeaderboard({ limit });
      setTopPlayers(entries as LeaderboardEntry[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
      console.error('Leaderboard query error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [limit]);

  return {
    topPlayers,
    loading,
    error,
    refetch: fetchLeaderboard,
  };
};

/**
 * Hook to fetch player stats for multiple players
 */
export const usePlayerStatsQuery = (playerAddresses: string[]): UsePlayerStatsResult => {
  const [playerStats, setPlayerStats] = useState<Map<string, PlayerStats>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayerStats = async () => {
    if (playerAddresses.length === 0) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const statsMap = new Map<string, PlayerStats>();

      // Fetch stats for each player
      await Promise.all(
        playerAddresses.map(async (address) => {
          try {
            const stats = await queryPlayerStats(address);
            if (stats) {
              statsMap.set(address, stats as PlayerStats);
            }
          } catch (err) {
            console.error(`Failed to fetch stats for ${address}:`, err);
          }
        })
      );

      setPlayerStats(statsMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch player stats');
      console.error('Player stats query error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (playerAddresses.length > 0) {
      fetchPlayerStats();
    }
  }, [playerAddresses.join(',')]); // Join to create stable dependency

  return {
    playerStats,
    loading,
    error,
    refetch: fetchPlayerStats,
  };
};

/**
 * Hook to fetch active users (last 24 hours)
 */
export const useActiveUsersQuery = () => {
  const [activeUsers, setActiveUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const users = await queryActiveUsers();
      setActiveUsers(users as UserAccount[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch active users');
      console.error('Active users query error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveUsers();
    // Refresh every 5 minutes
    const interval = setInterval(fetchActiveUsers, 300000);
    return () => clearInterval(interval);
  }, []);

  return {
    activeUsers,
    loading,
    error,
    refetch: fetchActiveUsers,
  };
};

/**
 * Hook to fetch leaderboard statistics
 */
export const useLeaderboardStatsQuery = () => {
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalGames: 0,
    averageScore: 0,
    highestScore: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const leaderboardStats = await getLeaderboardStats();
      setStats(leaderboardStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard stats');
      console.error('Leaderboard stats query error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh every 10 minutes
    const interval = setInterval(fetchStats, 600000);
    return () => clearInterval(interval);
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
