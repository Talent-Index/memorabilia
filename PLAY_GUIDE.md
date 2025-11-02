# 🎮 How to Play Memorabilia

## Quick Start Options

### Option A: Command Line (Fastest - 10 minutes)
Play the game using terminal commands - great for testing!

### Option B: Web Interface (Best Experience - 1-2 hours)
Build a visual game interface - full game experience!

### Option C: Telegram Mini App (Full Integration - 2-3 hours)
Play inside Telegram with friends!

---

## Option A: Command Line Play 🖥️

### 1. Install Dojo

```bash
# Install Dojo framework
curl -L https://install.dojoengine.org | bash

# Restart terminal or source your shell config
source ~/.bashrc  # or ~/.zshrc

# Install latest version
dojoup

# Verify installation
sozo --version
katana --version
```

### 2. Build the Game

```bash
# Navigate to project directory
cd /home/daniel/Documents/augment-projects/Memorabilia

# Build contracts
sozo build

# Run tests
sozo test
```

### 3. Start Local Blockchain

```bash
# Terminal 1: Start Katana (local Starknet node)
katana --disable-fee
```

Keep this terminal running!

### 4. Deploy Contracts

```bash
# Terminal 2: Deploy to Katana
sozo migrate apply

# Save the World address that's printed
# It will look like: 0x...
```

### 5. Play the Game!

```bash
# Register your account
# Format: telegram_id, owner_public_key, session_public_key
sozo execute account_registry register_account \
  --calldata 123456789,0x1234567890abcdef,0xabcdef1234567890

# Start a new game
# Difficulty: 1 (Easy), 2 (Medium), 3 (Hard)
sozo execute game_system start_game --calldata 1

# The game_id will be in the output events
# Let's say it's game_id = 1

# Flip first card (game_id=1, card_index=0)
sozo execute game_system flip_card --calldata 1,0

# Flip second card (game_id=1, card_index=1)
sozo execute game_system flip_card --calldata 1,1

# Check if they match
sozo execute game_system check_match --calldata 1

# Continue flipping pairs until all cards are matched!

# View current game state
sozo model get GameState 1

# View your stats
sozo model get PlayerStats <your_address>

# View leaderboard
sozo model get LeaderboardEntry 1
```

### Example Game Session

```bash
# Start Easy game (4 pairs, 8 cards)
$ sozo execute game_system start_game --calldata 1
# Output: game_id = 42

# Flip cards and find matches
$ sozo execute game_system flip_card --calldata 42,0
$ sozo execute game_system flip_card --calldata 42,1
$ sozo execute game_system check_match --calldata 42
# Output: No match! Cards flip back

$ sozo execute game_system flip_card --calldata 42,0
$ sozo execute game_system flip_card --calldata 42,4
$ sozo execute game_system check_match --calldata 42
# Output: Match! Cards stay flipped

# Continue until all pairs are matched...

# View final score
$ sozo model get GameState 42
# Shows: score, moves, time, status: Won
```

---

## Option B: Web Interface 🌐

### 1. Create Frontend Project

```bash
# Create React app with Vite
npm create vite@latest memorabilia-ui -- --template react-ts
cd memorabilia-ui

# Install dependencies
npm install
npm install @dojoengine/core @dojoengine/create-burner
npm install starknet
npm install @dojoengine/torii-client
```

### 2. Create Simple Game UI

I can help you create a simple web interface! Would you like me to:
1. Create a basic HTML/CSS/JS game interface?
2. Create a React-based game with animations?
3. Create a full Telegram Mini App?

Let me know and I'll generate the frontend code for you!

### 3. Connect to Deployed Contracts

```typescript
// In your frontend
const WORLD_ADDRESS = "0x..."; // From deployment
const RPC_URL = "http://localhost:5050"; // Katana

// Connect and play!
```

---

## Option C: Telegram Mini App 📱

See **TELEGRAM_INTEGRATION.md** for complete guide!

### Quick Steps:
1. Create Telegram bot via @BotFather
2. Build web interface (Option B)
3. Deploy to hosting (Vercel/Netlify)
4. Connect bot to your web app
5. Play in Telegram!

---

## Game Rules 📖

### Objective
Match all pairs of cards in the fewest moves and shortest time!

### How to Play
1. **Choose Difficulty**
   - Easy: 8 cards (4 pairs)
   - Medium: 16 cards (8 pairs)
   - Hard: 24 cards (12 pairs)

2. **Flip Cards**
   - Flip one card to reveal its value
   - Flip a second card to find its match

3. **Match Pairs**
   - If cards match: They stay flipped ✅
   - If cards don't match: They flip back ❌

4. **Win the Game**
   - Match all pairs to complete the game
   - Get scored based on moves and time

### Scoring System

```
Base Score:     10,000 points
Difficulty:     +1,000 (Easy), +1,500 (Medium), +2,000 (Hard)
Time Bonus:     +0 to +150 (faster = more points)
Move Penalty:   -10 per move above optimal
```

**Optimal Moves:**
- Easy: 8 moves (flip each card once)
- Medium: 16 moves
- Hard: 24 moves

**Star Rating:**
- ⭐⭐⭐ 3 Stars: ≤110% of optimal moves (excellent!)
- ⭐⭐ 2 Stars: ≤150% of optimal moves (good!)
- ⭐ 1 Star: Completed (nice try!)

**Letter Grade:**
- S: 12,000+ points (perfect!)
- A: 11,000+ points (excellent!)
- B: 10,000+ points (good!)
- C: 9,000+ points (okay)
- D: 8,000+ points (needs improvement)
- F: <8,000 points (try again!)

---

## Troubleshooting 🔧

### "sozo: command not found"
```bash
# Install Dojo
curl -L https://install.dojoengine.org | bash
dojoup
```

### "Connection refused" when deploying
```bash
# Make sure Katana is running
katana --disable-fee
```

### "Build failed"
```bash
# Check Scarb version
scarb --version

# Clean and rebuild
sozo clean
sozo build
```

### "Transaction failed"
```bash
# Check account has funds (on testnet)
# On Katana, use pre-funded accounts
```

---

## Next Steps 🚀

### For Testing
1. ✅ Install Dojo
2. ✅ Build contracts
3. ✅ Deploy locally
4. ✅ Play via CLI
5. ✅ Check leaderboard

### For Production
1. Deploy to Starknet testnet
2. Build web interface
3. Add Telegram integration
4. Invite friends to play!
5. Deploy to mainnet

---

## Need Help? 💬

- **Dojo Docs**: https://book.dojoengine.org/
- **Starknet Docs**: https://docs.starknet.io/
- **Project Docs**: See README.md
- **Quick Start**: See QUICKSTART.md
- **Telegram Integration**: See TELEGRAM_INTEGRATION.md

---

## What Would You Like to Do?

**A) Play via command line now**
→ I'll help you install Dojo and deploy locally

**B) Build a web interface**
→ I'll create a React game UI for you

**C) Create Telegram Mini App**
→ I'll guide you through full integration

**D) Deploy to testnet**
→ I'll help you deploy to Starknet testnet

Just let me know! 🎮

