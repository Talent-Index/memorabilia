# Dashboard Quick Reference

## 🚀 Getting Started (60 seconds)

### 1. Environment Setup
```bash
# Create .env.local in frontend/
cat > .env.local << EOF
VITE_TORII_URL=http://localhost:8080
VITE_RPC_URL=http://localhost:5050
VITE_WORLD_ADDRESS=0x...
VITE_NETWORK=katana
EOF
```

### 2. Start Services
```bash
# Terminal 1: Dojo
cd your-dojo-project
sozo build
sozo migrate apply --name dev

# Terminal 2: Torii
torii --world 0x... --rpc http://localhost:5050

# Terminal 3: Frontend
cd frontend
bun dev
```

### 3. Access Dashboard
- Open app in browser
- Click **"📊 Dashboard"** button in header
- View all player data in real-time!

## 📊 Dashboard Features

| Feature | Description | Location |
|---------|-------------|----------|
| **Users Tab** | Search/filter all players | Main tab |
| **Leaderboard Tab** | Top 100 rankings | Main tab |
| **Analytics Tab** | Real-time statistics | Main tab |
| **Auto-refresh** | Update every 30s | Header button |
| **Search** | Find by ID or wallet | Users tab |
| **Sort** | By games, activity, joined | Users tab |

## 🔗 API Quick Reference

### Import
```typescript
import {
  queryUserAccounts,
  queryLeaderboard,
  queryPlayerStats,
  queryActiveUsers,
  getLeaderboardStats,
  toriiQuery,
} from './dojo/toriiClient';
```

### Quick Queries
```typescript
// All users
const users = await queryUserAccounts({ limit: 1000 });

// Top 100
const leaders = await queryLeaderboard({ limit: 100 });

// One player
const stats = await queryPlayerStats('0x...');

// Active now
const active = await queryActiveUsers();

// Stats
const stats = await getLeaderboardStats();
```

## ⚙️ Hooks Quick Reference

```typescript
import { 
  useUserQuery, 
  useLeaderboardQuery,
  useActiveUsersQuery,
  useLeaderboardStatsQuery 
} from '../hooks/useUserQuery';

// Usage in component
const { allUsers, loading, error, refetch } = useUserQuery();

// With error handling
if (error) return <div>Error: {error}</div>;
if (loading) return <div>Loading...</div>;

// Manual refresh
<button onClick={refetch}>Refresh</button>
```

## 🎨 Data Models

### UserAccount
```typescript
{
  telegram_id: string;      // "123456789"
  account_address: string;  // "0x..."
  total_games: number;      // 5
  last_active: number;      // timestamp
  is_active: boolean;       // true
}
```

### LeaderboardEntry
```typescript
{
  rank: number;         // 1-100
  telegram_id: string;  // "123456789"
  score: number;        // 1000
  difficulty: number;   // 1|2|3
  moves: number;        // 20
  time: number;         // 120 (seconds)
}
```

### PlayerStats
```typescript
{
  total_games: number;
  best_score: number;
  average_score: number;
  games_by_difficulty: { easy, medium, hard }
}
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| No data | Check Torii URL, verify contracts deployed |
| Slow | Reduce query limit, disable auto-refresh |
| 404 error | Ensure Torii running on port 8080 |
| CORS error | Check Torii CORS configuration |

## 📁 File Locations

```
frontend/
├── src/dojo/toriiClient.ts        ← GraphQL queries
├── src/hooks/useUserQuery.ts      ← React hooks
├── src/components/UserDashboard.tsx ← UI component
└── TORII_INTEGRATION.md            ← Full docs
```

## 🔄 Auto-Refresh Intervals

- **Dashboard**: 30 seconds (manual toggle)
- **Active Users Hook**: 5 minutes (auto)
- **Leaderboard Stats Hook**: 10 minutes (auto)

## 💾 Common Patterns

### Use in Component
```tsx
function MyComponent() {
  const { allUsers, loading, error } = useUserQuery();
  
  if (loading) return <Loading />;
  if (error) return <Error msg={error} />;
  
  return (
    <div>
      {allUsers.map(user => (
        <UserCard key={user.telegram_id} user={user} />
      ))}
    </div>
  );
}
```

### Manual Query
```tsx
const handleRefresh = async () => {
  const users = await queryUserAccounts({ limit: 500 });
  setUsers(users);
};
```

### Batch Operations
```typescript
const leaderboard = await queryLeaderboard({ limit: 100 });
const stats = await Promise.all(
  leaderboard.map(entry => queryPlayerStats(entry.player))
);
```

## 📈 Performance Tips

1. **Paginate** - Use `limit` and `offset` for large queries
2. **Cache** - Hooks cache results between renders
3. **Batch** - Fetch multiple players together with `Promise.all`
4. **Debounce** - Delay search input queries
5. **Lazy Load** - Load tabs only when needed

## 🎯 Next Features

Potential additions:
- Real-time WebSocket subscriptions
- Export data to CSV
- Charts and graphs
- Player profiles
- Ban/kick controls
- Game history filter

## 📚 More Info

- **Full Guide**: See `TORII_INTEGRATION.md`
- **Setup Steps**: See `DASHBOARD_SETUP.md`
- **GraphQL Docs**: Visit `http://localhost:8080/graphql`

## ✅ Checklist

- [ ] Contracts deployed
- [ ] Torii running
- [ ] Environment variables set
- [ ] Frontend running
- [ ] Dashboard button visible
- [ ] Data loading in tabs
- [ ] Auto-refresh working

---

**Ready to track your players!** 🎮
