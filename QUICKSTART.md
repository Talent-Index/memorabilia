# 🚀 Memorabilia Quick Start Guide

This guide will help you get Memorabilia up and running quickly.

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
# Install Dojo
curl -L https://install.dojoengine.org | bash
dojoup

# Verify installation
sozo --version
katana --version
```

### 2. Build & Test

```bash
# Build the project
sozo build

# Run tests
sozo test
```

### 3. Deploy Locally

```bash
# Terminal 1: Start Katana (local Starknet node)
katana --disable-fee

# Terminal 2: Deploy contracts
chmod +x scripts/deploy.sh
./scripts/deploy.sh katana
```

## 🎮 Playing the Game

### Example Game Flow

```bash
# Set your world address from deployment
export WORLD_ADDRESS=<your_world_address>

# 1. Register an account
sozo execute $WORLD_ADDRESS account_registry register_account \
  --calldata 123456789,0x123,0x456

# 2. Start a game (difficulty: 1=Easy, 2=Medium, 3=Hard)
sozo execute $WORLD_ADDRESS game_system start_game \
  --calldata 2

# 3. Flip cards (game_id, card_index)
sozo execute $WORLD_ADDRESS game_system flip_card \
  --calldata 1,0

sozo execute $WORLD_ADDRESS game_system flip_card \
  --calldata 1,1

# 4. Check for match
sozo execute $WORLD_ADDRESS game_system check_match \
  --calldata 1

# 5. Query game state
sozo model get $WORLD_ADDRESS GameState 1
```

## 📖 Common Commands

### Account Management

```bash
# Register account
sozo execute $WORLD_ADDRESS account_registry register_account \
  --calldata <telegram_id>,<owner_key>,<session_key>

# Update session key
sozo execute $WORLD_ADDRESS account_registry update_session_key \
  --calldata <telegram_id>,<new_session_key>

# Get account info
sozo model get $WORLD_ADDRESS UserAccount <telegram_id>
```

### Game Operations

```bash
# Start easy game
sozo execute $WORLD_ADDRESS game_system start_game --calldata 1

# Start medium game
sozo execute $WORLD_ADDRESS game_system start_game --calldata 2

# Start hard game
sozo execute $WORLD_ADDRESS game_system start_game --calldata 3

# Flip a card
sozo execute $WORLD_ADDRESS game_system flip_card \
  --calldata <game_id>,<card_index>

# Check match
sozo execute $WORLD_ADDRESS game_system check_match \
  --calldata <game_id>

# Get game state
sozo model get $WORLD_ADDRESS GameState <game_id>

# Abandon game
sozo execute $WORLD_ADDRESS game_system abandon_game \
  --calldata <game_id>
```

### Leaderboard

```bash
# Submit score (called automatically on game completion)
sozo execute $WORLD_ADDRESS leaderboard_system submit_score \
  --calldata <game_id>,<telegram_id>,<score>,<difficulty>,<moves>,<time>

# Get leaderboard entry
sozo model get $WORLD_ADDRESS LeaderboardEntry <rank>

# Get player stats
sozo model get $WORLD_ADDRESS PlayerStats <player_address>
```

### Greeting System (Demo)

```bash
# Set greeting
sozo execute $WORLD_ADDRESS greeting_system set_greeting \
  --calldata "Hello Memorabilia"

# Get greeting
sozo model get $WORLD_ADDRESS Greeting <user_address>
```

## 🎯 Complete Game Example

Here's a complete example of playing a game:

```bash
# 1. Start a medium difficulty game
GAME_ID=$(sozo execute $WORLD_ADDRESS game_system start_game --calldata 2 | grep -o 'game_id: [0-9]*' | cut -d' ' -f2)

echo "Started game: $GAME_ID"

# 2. Get initial game state
sozo model get $WORLD_ADDRESS GameState $GAME_ID

# 3. Flip first card
sozo execute $WORLD_ADDRESS game_system flip_card --calldata $GAME_ID,0

# 4. Flip second card
sozo execute $WORLD_ADDRESS game_system flip_card --calldata $GAME_ID,1

# 5. Check if they match
MATCH=$(sozo execute $WORLD_ADDRESS game_system check_match --calldata $GAME_ID)

if [[ $MATCH == *"true"* ]]; then
  echo "Match found!"
else
  echo "No match, try again"
fi

# 6. Continue flipping until all pairs are matched...

# 7. Check final score
sozo model get $WORLD_ADDRESS GameState $GAME_ID
```

## 🔍 Debugging

### View All Models

```bash
# List all models
sozo model list $WORLD_ADDRESS

# Get model schema
sozo model schema $WORLD_ADDRESS GameState
```

### View Events

```bash
# Watch for events
sozo events $WORLD_ADDRESS --follow

# Filter specific events
sozo events $WORLD_ADDRESS --event GameStarted
sozo events $WORLD_ADDRESS --event CardFlipped
sozo events $WORLD_ADDRESS --event GameCompleted
```

### Check World State

```bash
# Get world info
sozo world info $WORLD_ADDRESS

# List all systems
sozo system list $WORLD_ADDRESS
```

## 🧪 Testing Specific Features

### Test Account Registration

```bash
# Register test account
sozo execute $WORLD_ADDRESS account_registry register_account \
  --calldata 999999999,0xABCD,0xEF01

# Verify registration
sozo execute $WORLD_ADDRESS account_registry is_account_registered \
  --calldata 999999999
```

### Test Card Shuffling

```bash
# Start multiple games to see different card arrangements
for i in {1..3}; do
  sozo execute $WORLD_ADDRESS game_system start_game --calldata 1
  sleep 1
done
```

### Test Scoring

```bash
# Complete a game quickly for high score
# Complete a game slowly for lower score
# Compare the scores
```

## 📊 Monitoring

### Watch Game Progress

```bash
# In one terminal, watch events
sozo events $WORLD_ADDRESS --follow

# In another terminal, play the game
# You'll see events in real-time
```

### Track Leaderboard Changes

```bash
# Check top 10 players
for rank in {1..10}; do
  echo "Rank $rank:"
  sozo model get $WORLD_ADDRESS LeaderboardEntry $rank
done
```

## 🐛 Troubleshooting

### Build Errors

```bash
# Clean and rebuild
sozo clean
sozo build
```

### Migration Issues

```bash
# Reset local Katana and redeploy
# Stop Katana (Ctrl+C)
# Restart Katana
katana --disable-fee

# Redeploy
./scripts/deploy.sh katana
```

### Gas Issues

```bash
# Make sure Katana is running with --disable-fee
katana --disable-fee

# Or increase gas limit
sozo execute --max-fee 1000000 ...
```

## 🎓 Next Steps

1. **Integrate with Telegram**: Build a Telegram Mini App frontend
2. **Add Session Keys**: Implement gasless transactions
3. **Create UI**: Build a web interface for the game
4. **Add Features**: Implement tournaments, achievements, NFTs

## 📚 Additional Resources

- [Dojo Documentation](https://book.dojoengine.org/)
- [Cairo Language](https://book.cairo-lang.org/)
- [Starknet Docs](https://docs.starknet.io/)
- [Sozo CLI Reference](https://book.dojoengine.org/toolchain/sozo/)

## 💬 Support

- GitHub Issues: Report bugs and request features
- Dojo Discord: Join the community
- Documentation: Check the main README.md

---

Happy Gaming! 🎮✨

