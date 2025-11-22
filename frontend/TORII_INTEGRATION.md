# Torii GraphQL Integration Guide

This guide explains how the Memorabilia dashboard connects to your Dojo world's Torii indexer for real-time player data.

## Overview

The dashboard uses GraphQL queries through the Torii indexer to fetch:
- **User Accounts** - All registered Telegram players
- **Leaderboard** - Top 100 players with scores
- **Player Stats** - Individual player performance metrics
- **Active Users** - Players active in the last 24 hours

## Configuration

### Environment Variables

Set these in your `.env.local` file:

```bash
# Torii GraphQL endpoint (defaults to http://localhost:8080)
VITE_TORII_URL=http://localhost:8080

# RPC endpoint
VITE_RPC_URL=http://localhost:5050

# World contract address
VITE_WORLD_ADDRESS=0x...

# Network (katana, sepolia, mainnet)
VITE_NETWORK=katana
```

## Features

### 1. Real-Time Queries

All dashboard data queries are powered by Torii GraphQL:

```typescript
// Query all users
const users = await queryUserAccounts({ limit: 1000 });

// Query leaderboard
const leaderboard = await queryLeaderboard({ limit: 100 });

// Query specific player stats
const stats = await queryPlayerStats('0x...');
```

### 2. Auto-Refresh

The dashboard automatically refreshes data every 30 seconds when auto-refresh is enabled:

```tsx
// Toggle with button in dashboard header
✅ Auto - Auto-refresh enabled
⏸️ Manual - Auto-refresh disabled
```

### 3. Hooks

Three main React hooks for data fetching:

#### `useUserQuery()`
```tsx
const { allUsers, loading, error, refetch } = useUserQuery();
// Fetches all registered users
```

#### `useLeaderboardQuery(limit)`
```tsx
const { topPlayers, loading, error, refetch } = useLeaderboardQuery(100);
// Fetches top N leaderboard entries
```

#### `useActiveUsersQuery()`
```tsx
const { activeUsers, loading, error, refetch } = useActiveUsersQuery();
// Fetches users active in last 24 hours
// Auto-refreshes every 5 minutes
```

#### `useLeaderboardStatsQuery()`
```tsx
const { stats, loading, error, refetch } = useLeaderboardStatsQuery();
// Returns: { totalPlayers, totalGames, averageScore, highestScore }
// Auto-refreshes every 10 minutes
```

### 4. Direct GraphQL Queries

Use `toriiClient.ts` for advanced queries:

```typescript
import {
  queryUserAccounts,
  queryLeaderboard,
  queryPlayerStats,
  queryActiveUsers,
  queryPlayerGames,
  getLeaderboardStats,
} from './dojo/toriiClient';

// Query player's recent games
const games = await queryPlayerGames('0xplayer', 10);

// Get comprehensive leaderboard statistics
const stats = await getLeaderboardStats();
```

## Data Models

### UserAccount
```typescript
{
  telegram_id: string;           // Unique Telegram ID
  owner_public_key: string;      // Owner's public key
  session_public_key: string;    // Session key for transactions
  account_address: string;       // Derived account address
  created_at: number;            // Registration timestamp
  last_active: number;           // Last activity timestamp
  nonce: number;                 // Session nonce
  total_games: number;           // Games played
  is_active: boolean;            // Active status
}
```

### LeaderboardEntry
```typescript
{
  rank: number;                  // Position on leaderboard
  player: string;                // Player address
  telegram_id: string;           // Telegram ID
  score: number;                 // Game score
  difficulty: number;            // 1=Easy, 2=Medium, 3=Hard
  moves: number;                 // Moves taken
  time: number;                  // Time in seconds
  game_id: number;               // Game ID
  achieved_at: number;           // Achievement timestamp
}
```

### PlayerStats
```typescript
{
  player: string;                // Player address
  total_games: number;           // Games played
  total_wins: number;            // Games won
  best_score: number;            // Highest score
  best_time: number;             // Fastest time
  total_moves: number;           // Total moves across all games
  average_score: number;         // Average score
  games_by_difficulty: {         // Games per difficulty
    easy: number;
    medium: number;
    hard: number;
  };
}
```

## Dashboard Components

### User Management Tab
- Search users by Telegram ID or wallet address
- Sort by: Games Played, Last Active, Recently Joined
- View account status and activity
- Manual or auto-refresh

### Leaderboard Tab
- Top 100 ranked players
- Medal system (🥇🥈🥉) for top 3
- Difficulty breakdown
- Detailed performance metrics

### Analytics Tab
- Total registered users
- Active players (last 24 hours)
- Total games played
- Average score across leaderboard
- Record highest score
- Games by difficulty breakdown
- Recent player activity

## API Reference

### toriiQuery<T>(query: string): Promise<T>
Execute a raw GraphQL query against Torii.

```typescript
const result = await toriiQuery<{ userAccountConnection: ToriiConnection<any> }>(query);
```

### queryUserAccounts(options?)
Fetch registered users.

**Options:**
- `limit` (default: 100) - Results per page
- `offset` (default: 0) - Pagination offset
- `orderBy` (default: 'created_at') - Sort field
- `order` (default: 'desc') - Sort direction

```typescript
const users = await queryUserAccounts({ limit: 50, offset: 0 });
```

### queryLeaderboard(options?)
Fetch leaderboard entries.

```typescript
const entries = await queryLeaderboard({ limit: 100 });
```

### queryPlayerStats(playerAddress: string)
Get stats for a specific player.

```typescript
const stats = await queryPlayerStats('0x...');
```

### queryActiveUsers()
Get users active in last 24 hours.

```typescript
const active = await queryActiveUsers();
```

### queryPlayerGames(playerAddress: string, limit?)
Get player's game history.

```typescript
const games = await queryPlayerGames('0x...', 10);
```

### getLeaderboardStats()
Get aggregate leaderboard statistics.

```typescript
const stats = await getLeaderboardStats();
// Returns: { totalPlayers, totalGames, averageScore, highestScore }
```

## Error Handling

All queries have built-in error handling:

```tsx
const { data, loading, error, refetch } = useUserQuery();

if (error) {
  return <div className="error">Error: {error}</div>;
}

if (loading) {
  return <div className="loading">Loading...</div>;
}
```

## WebSocket Subscriptions (Advanced)

For real-time updates, use WebSocket subscriptions:

```typescript
import { subscribeToUserUpdates } from './dojo/toriiClient';

// Subscribe to user updates
const unsubscribe = subscribeToUserUpdates((user) => {
  console.log('User updated:', user);
});

// Cleanup
unsubscribe();
```

## Performance Tips

1. **Pagination** - Use `limit` and `offset` for large datasets
2. **Caching** - Hooks cache results; use `refetch()` to manually update
3. **Auto-refresh** - Only enable when needed
4. **Batch Queries** - Combine multiple queries to reduce requests

## Troubleshooting

### "Torii query failed"
- Verify `VITE_TORII_URL` is correct
- Check if Torii indexer is running
- Ensure GraphQL endpoint is accessible

### No data returned
- Check if entities exist in your Dojo world
- Verify world contract is deployed
- Check Torii has indexed the world

### Performance issues
- Reduce query `limit` parameter
- Disable auto-refresh when not needed
- Check network connection to Torii

## Next Steps

1. **Deploy your contracts** to ensure Torii can index them
2. **Test queries** manually in GraphQL playground at `http://localhost:8080/graphql`
3. **Enable dashboard** by navigating to the Dashboard tab
4. **Monitor metrics** with auto-refresh enabled

## Related Files

- `src/dojo/toriiClient.ts` - GraphQL client implementation
- `src/hooks/useUserQuery.ts` - React hooks for data fetching
- `src/components/UserDashboard.tsx` - Dashboard UI component
- `src/dojo/config.ts` - Configuration and model definitions
