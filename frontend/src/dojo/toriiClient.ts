import { dojoConfig, MODELS } from './config';

/**
 * Torii GraphQL Client
 * Connects to your Dojo world's Torii indexer for querying entities
 */

interface ToriiEdge<T> {
  node: T;
  cursor: string;
}

interface ToriiConnection<T> {
  edges: ToriiEdge<T>[];
  pageInfo: {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    startCursor: string;
    endCursor: string;
  };
}

export interface ToriiQueryOptions {
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  orderBy?: string;
}

/**
 * Execute a GraphQL query against the Torii indexer
 */
async function toriiQuery<T>(query: string): Promise<T> {
  try {
    const response = await fetch(`${dojoConfig.toriiUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Torii query failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GraphQL error: ${JSON.stringify(data.errors)}`);
    }

    return data.data as T;
  } catch (error) {
    console.error('Torii query error:', error);
    throw error;
  }
}

/**
 * Query all user accounts from the Dojo world
 */
export async function queryUserAccounts(
  options: ToriiQueryOptions = {}
): Promise<any[]> {
  const { limit = 100, offset = 0, orderBy = 'created_at', order = 'desc' } = options;

  const query = `
    query {
      userAccountConnection(
        first: ${limit}
        skip: ${offset}
        orderBy: ${orderBy}_${order.toUpperCase()}
      ) {
        edges {
          node {
            telegram_id
            owner_public_key
            session_public_key
            account_address
            created_at
            last_active
            nonce
            total_games
            is_active
          }
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
  `;

  try {
    const result = await toriiQuery<{
      userAccountConnection: ToriiConnection<any>;
    }>(query);

    return result.userAccountConnection.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Failed to query user accounts:', error);
    return [];
  }
}

/**
 * Query leaderboard entries
 */
export async function queryLeaderboard(
  options: ToriiQueryOptions = {}
): Promise<any[]> {
  const { limit = 100, offset = 0 } = options;

  const query = `
    query {
      leaderboardEntryConnection(
        first: ${limit}
        skip: ${offset}
        orderBy: rank_ASC
      ) {
        edges {
          node {
            rank
            player
            telegram_id
            score
            difficulty
            moves
            time
            game_id
            achieved_at
          }
        }
      }
    }
  `;

  try {
    const result = await toriiQuery<{
      leaderboardEntryConnection: ToriiConnection<any>;
    }>(query);

    return result.leaderboardEntryConnection.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Failed to query leaderboard:', error);
    return [];
  }
}

/**
 * Query player stats for a specific player
 */
export async function queryPlayerStats(playerAddress: string): Promise<any | null> {
  const query = `
    query {
      playerStats(id: "${playerAddress}") {
        player
        total_games
        total_wins
        best_score
        best_time
        total_moves
        average_score
        games_by_difficulty {
          easy
          medium
          hard
        }
      }
    }
  `;

  try {
    const result = await toriiQuery<{ playerStats: any }>(query);
    return result.playerStats || null;
  } catch (error) {
    console.error('Failed to query player stats:', error);
    return null;
  }
}

/**
 * Query a specific user account by telegram ID
 */
export async function queryUserByTelegramId(telegramId: string): Promise<any | null> {
  const query = `
    query {
      userAccount(telegram_id: "${telegramId}") {
        telegram_id
        owner_public_key
        session_public_key
        account_address
        created_at
        last_active
        nonce
        total_games
        is_active
      }
    }
  `;

  try {
    const result = await toriiQuery<{ userAccount: any }>(query);
    return result.userAccount || null;
  } catch (error) {
    console.error('Failed to query user by telegram ID:', error);
    return null;
  }
}

/**
 * Query active users (those who played in the last 24 hours)
 */
export async function queryActiveUsers(): Promise<any[]> {
  const twentyFourHoursAgo = Math.floor((Date.now() - 86400000) / 1000);

  const query = `
    query {
      userAccountConnection(
        where: {
          last_active_gt: ${twentyFourHoursAgo}
          is_active: true
        }
        orderBy: last_active_DESC
      ) {
        edges {
          node {
            telegram_id
            account_address
            total_games
            last_active
            is_active
          }
        }
      }
    }
  `;

  try {
    const result = await toriiQuery<{
      userAccountConnection: ToriiConnection<any>;
    }>(query);

    return result.userAccountConnection.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Failed to query active users:', error);
    return [];
  }
}

/**
 * Query game states for a specific player
 */
export async function queryPlayerGames(playerAddress: string, limit: number = 10): Promise<any[]> {
  const query = `
    query {
      gameStateConnection(
        where: { player: "${playerAddress}" }
        first: ${limit}
        orderBy: started_at_DESC
      ) {
        edges {
          node {
            game_id
            player
            difficulty
            cards
            flipped_indices
            matched_count
            total_pairs
            moves
            score
            started_at
            completed_at
            status
            elapsed_time
          }
        }
      }
    }
  `;

  try {
    const result = await toriiQuery<{
      gameStateConnection: ToriiConnection<any>;
    }>(query);

    return result.gameStateConnection.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Failed to query player games:', error);
    return [];
  }
}

/**
 * Get leaderboard statistics
 */
export async function getLeaderboardStats(): Promise<{
  totalPlayers: number;
  totalGames: number;
  averageScore: number;
  highestScore: number;
}> {
  try {
    const leaderboard = await queryLeaderboard({ limit: 100 });

    if (leaderboard.length === 0) {
      return {
        totalPlayers: 0,
        totalGames: 0,
        averageScore: 0,
        highestScore: 0,
      };
    }

    const totalGames = leaderboard.reduce((sum, entry) => sum + entry.moves, 0);
    const averageScore =
      leaderboard.reduce((sum, entry) => sum + entry.score, 0) / leaderboard.length;
    const highestScore = Math.max(...leaderboard.map((entry) => entry.score));

    return {
      totalPlayers: leaderboard.length,
      totalGames,
      averageScore: Math.round(averageScore),
      highestScore,
    };
  } catch (error) {
    console.error('Failed to get leaderboard stats:', error);
    return {
      totalPlayers: 0,
      totalGames: 0,
      averageScore: 0,
      highestScore: 0,
    };
  }
}

/**
 * Subscribe to real-time updates (WebSocket)
 * Note: This requires Torii to support WebSocket subscriptions
 */
export function subscribeToUserUpdates(callback: (user: any) => void): () => void {
  const wsUrl = dojoConfig.toriiUrl.replace('http', 'ws');
  const ws = new WebSocket(`${wsUrl}/graphql`);

  const subscription = `
    subscription {
      userAccountUpdated {
        telegram_id
        total_games
        last_active
        is_active
      }
    }
  `;

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'start', payload: { query: subscription } }));
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.payload?.data?.userAccountUpdated) {
        callback(data.payload.data.userAccountUpdated);
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  // Return cleanup function
  return () => {
    ws.close();
  };
}
