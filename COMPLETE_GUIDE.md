# 🎮 Memorabilia - Complete Guide

Welcome to Memorabilia! This guide will take you from zero to a fully deployed on-chain memory game.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Overview](#project-overview)
3. [Architecture](#architecture)
4. [Development](#development)
5. [Deployment](#deployment)
6. [Telegram Integration](#telegram-integration)
7. [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
./start.sh
```

Follow the interactive menu to:
- Build contracts
- Run tests
- Deploy to Katana
- Start frontend

### Option 2: Manual Setup

#### Step 1: Install Dojo

```bash
curl -L https://install.dojoengine.org | bash
dojoup
```

#### Step 2: Start Katana (Terminal 1)

```bash
katana --disable-fee
```

#### Step 3: Build & Deploy (Terminal 2)

```bash
# Build contracts
sozo build

# Run tests
sozo test

# Deploy
sozo migrate apply
```

**Save the World address!**

#### Step 4: Setup Frontend (Terminal 2)

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` and set `VITE_WORLD_ADDRESS` to your deployed world address.

#### Step 5: Start Frontend (Terminal 2)

```bash
npm run dev
```

Open http://localhost:3000 🎉

## 📖 Project Overview

### What is Memorabilia?

Memorabilia is a fully on-chain memory card game built with:
- **Dojo**: Provable game engine for Starknet
- **Cairo**: Smart contract language
- **React**: Modern UI framework
- **Telegram**: Mini App integration

### Features

✨ **Game Features**
- 3 difficulty levels (Easy, Medium, Hard)
- Smart scoring system
- Star ratings (1-3 stars)
- Grade system (S, A, B, C)
- Global leaderboard

🔐 **Blockchain Features**
- Fully on-chain game state
- Account abstraction
- Session keys for gasless gameplay
- Provable randomness
- Immutable leaderboard

📱 **Telegram Features**
- Mini App integration
- Haptic feedback
- Theme adaptation
- User authentication
- Social sharing

## 🏗️ Architecture

### Smart Contracts

```
src/
├── models/                 # Data models (ECS components)
│   ├── card.cairo         # Card entity
│   ├── game_state.cairo   # Game state
│   ├── user_account.cairo # User accounts
│   ├── session_policy.cairo # Session keys
│   └── leaderboard.cairo  # Rankings
│
├── systems/               # Game logic (ECS systems)
│   ├── greeting_system.cairo
│   ├── account_registry.cairo
│   ├── game_system.cairo
│   └── leaderboard_system.cairo
│
└── utils/                 # Helper functions
    ├── random.cairo       # RNG
    ├── card_generator.cairo # Card shuffling
    └── scoring.cairo      # Score calculation
```

### Frontend

```
frontend/
├── src/
│   ├── components/        # React components
│   │   ├── Card.tsx      # Card with flip animation
│   │   ├── GameBoard.tsx # Game grid
│   │   ├── DifficultySelector.tsx
│   │   ├── WinModal.tsx  # Victory screen
│   │   ├── Leaderboard.tsx
│   │   ├── Header.tsx
│   │   └── LoadingScreen.tsx
│   │
│   ├── dojo/             # Blockchain integration
│   │   ├── config.ts     # Contract addresses
│   │   ├── setup.ts      # Dojo initialization
│   │   └── gameController.ts # Game logic
│   │
│   ├── telegram/         # Telegram integration
│   │   └── telegram.ts   # WebApp API
│   │
│   ├── store/            # State management
│   │   └── gameStore.ts  # Zustand store
│   │
│   └── types/            # TypeScript types
│       └── index.ts
```

## 💻 Development

### Running Tests

```bash
# All tests
sozo test

# Specific test
sozo test test_start_game
```

### Interacting with Contracts

```bash
# Register account
sozo execute account_registry register_account \
  --calldata 123456789,alice,alice_key

# Start game (difficulty: 1=Easy, 2=Medium, 3=Hard)
sozo execute game_system start_game --calldata 1

# Flip card
sozo execute game_system flip_card --calldata GAME_ID,CARD_INDEX

# Check match
sozo execute game_system check_match --calldata GAME_ID

# View game state
sozo model get GameState GAME_ID
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Style

The project uses:
- **Cairo**: Standard Dojo conventions
- **TypeScript**: Strict mode enabled
- **React**: Functional components with hooks
- **Tailwind CSS**: Utility-first styling

## 🚀 Deployment

### Testnet Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete instructions.

Quick version:

```bash
# 1. Configure testnet
# Edit dojo_sepolia.toml with your account

# 2. Deploy contracts
sozo --profile sepolia migrate apply

# 3. Deploy frontend to Vercel
cd frontend
vercel

# 4. Set environment variables in Vercel
# VITE_WORLD_ADDRESS, VITE_RPC_URL, etc.
```

### Production Deployment

⚠️ **Before mainnet:**
- Complete security audit
- Thorough testing on testnet
- Gas optimization
- Backup plan ready

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) Phase 6.

## 📱 Telegram Integration

### Setup Telegram Bot

See [TELEGRAM_BOT_SETUP.md](./TELEGRAM_BOT_SETUP.md) for complete guide.

Quick steps:

1. **Create Bot**
   ```
   Talk to @BotFather
   /newbot
   ```

2. **Create Mini App**
   ```
   /newapp
   Set Web App URL to your deployed frontend
   ```

3. **Test**
   - Open your bot in Telegram
   - Click the app button
   - Play the game!

### Telegram Features

The frontend automatically detects Telegram and enables:
- Haptic feedback on card flips
- Theme adaptation
- User authentication
- Native buttons
- Share functionality

## 🎮 How to Play

### Game Rules

1. **Choose Difficulty**
   - Easy: 8 cards (4 pairs)
   - Medium: 16 cards (8 pairs)
   - Hard: 24 cards (12 pairs)

2. **Match Pairs**
   - Click cards to flip them
   - Find matching pairs
   - Cards stay flipped when matched

3. **Win Condition**
   - Match all pairs to win
   - Fewer moves = higher score
   - Faster time = bonus points

### Scoring System

**Base Score**: 1000 points per difficulty level

**Bonuses**:
- Time bonus: Up to 500 points (faster = more)
- Move efficiency: Penalty for extra moves
- Difficulty multiplier: Easy (10x), Medium (15x), Hard (20x)

**Star Rating**:
- ⭐⭐⭐ 3 Stars: ≤110% of optimal moves
- ⭐⭐ 2 Stars: ≤150% of optimal moves
- ⭐ 1 Star: Completed

**Grade**:
- S: 10,000+ points
- A: 7,500+ points
- B: 5,000+ points
- C: Below 5,000 points

## 🔧 Troubleshooting

### Common Issues

#### "Dojo not found"
```bash
curl -L https://install.dojoengine.org | bash
dojoup
```

#### "Katana connection failed"
```bash
# Start Katana in a separate terminal
katana --disable-fee
```

#### "World address not set"
```bash
# Deploy contracts first
sozo migrate apply

# Copy the World address
# Edit frontend/.env and set VITE_WORLD_ADDRESS
```

#### "Frontend won't start"
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

#### "Telegram features not working"
- Only work inside Telegram app
- Use mock data for local development
- Test with ngrok for local Telegram testing

### Getting Help

- **Documentation**: See other .md files in this repo
- **Dojo Discord**: https://discord.gg/dojoengine
- **Starknet Discord**: https://discord.gg/starknet
- **GitHub Issues**: Report bugs and request features

## 📚 Additional Resources

### Documentation

- [README.md](./README.md) - Project overview
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment instructions
- [TELEGRAM_BOT_SETUP.md](./TELEGRAM_BOT_SETUP.md) - Telegram integration
- [frontend/README.md](./frontend/README.md) - Frontend documentation

### External Links

- [Dojo Book](https://book.dojoengine.org/)
- [Cairo Book](https://book.cairo-lang.org/)
- [Starknet Docs](https://docs.starknet.io/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)

## 🎯 Next Steps

After getting the game running:

1. **Play and Test**
   - Try all difficulty levels
   - Test in Telegram
   - Find and report bugs

2. **Customize**
   - Change card emojis
   - Adjust scoring
   - Add new features

3. **Deploy**
   - Deploy to testnet
   - Get feedback
   - Deploy to mainnet

4. **Promote**
   - Share with friends
   - Post on social media
   - Build a community

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file

## 🙏 Acknowledgments

Built with:
- [Dojo](https://dojoengine.org/) - Provable game engine
- [Starknet](https://starknet.io/) - Layer 2 scaling
- [Cairo](https://cairo-lang.org/) - Smart contract language
- [React](https://react.dev/) - UI framework
- [Telegram](https://telegram.org/) - Messaging platform

---

**Ready to play?** Run `./start.sh` and let's go! 🚀

