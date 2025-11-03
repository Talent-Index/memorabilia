# Memorabilia

## Submission Track
Full Game
Dojo telegram SDK	SDK	A fully on-chain memory card matching game built on Starknet using the Dojo framework, integrated with Telegram Mini Apps for seamless user experience through Account Abstraction.			
Team 3/ Memorabilia 
Link	https://github.com/Talent-Index/memorabilia																			

## Project Summary
A fully on-chain memory card matching game built on Starknet using the Dojo framework, integrated with Telegram Mini Apps for seamless user experience through Account Abstraction. The game features a custom Dojo Telegram SDK that enables gasless transactions and real-time game state updates.

## GitHub
[Memorabilia Repository](https://github.com/Talent-Index/memorabilia)

## Play
1. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install SDK dependencies
cd ../dojo-telegram-sdk
npm install
```

2. Start the game:
```bash
# Run in demo mode (no contracts required)
./scripts/run_local_demo.sh --demo
```

For full blockchain mode, see `DEPLOYMENT_GUIDE.md` for contract deployment steps.

## Twitter
- Project: @memorabiliadojo

## Team Members
- Ahmed [@ahmedabdikadir914](https://github.com/ahmedabdikadir914) - ahmedabdikadir914@gmail.com
- Leonard [@tweenhaven35](https://github.com/tweenhaven35) - tweenhaven35@gmail.com
- Daniel [@mwihoti](https://github.com/mwihoti) - DanielMwihoti@gmail.com
- Kelly [@gakikelly](https://github.com/gakikelly) - gakikelly403@gmail.com
- Peter Maina [@mainapeter](https://github.com/mainapeter) - mainapeterkanyuki@gmail.com
- Rosemary [@rozypopyl](https://github.com/rozypopyl) - Rozypopyl6@gmail.com

## Key Features
- Memory card matching game with multiple difficulty levels
- Real-time game state updates via Torii indexer
- Gasless transactions using Account Abstraction
- Telegram Mini App integration
- Custom Dojo Telegram SDK for easy integration
- On-chain leaderboard and achievements

## Technical Stack
- **Smart Contracts**: Cairo (Dojo framework)
- **Frontend**: React + Vite + Tailwind
- **Blockchain**: Starknet (Katana for local development)
- **Integration**: Telegram Mini Apps API
- **SDK**: Custom Dojo Telegram SDK
- **Indexing**: Torii for real-time updates
- **Greeting System**: Proof-of-concept for gasless interactions



## 🏗️ Architecture

```
memorabilia/
├── src/
│   ├── models/              # Data models
│   │   ├── user_account.cairo
│   │   ├── game_state.cairo
│   │   ├── card.cairo
│   │   ├── leaderboard.cairo
│   │   └── session_policy.cairo
│   ├── systems/             # Game systems (smart contracts)
│   │   ├── account_registry.cairo
│   │   ├── game_system.cairo
│   │   ├── greeting_system.cairo
│   │   └── leaderboard_system.cairo
│   ├── utils/               # Utility functions
│   │   ├── card_generator.cairo
│   │   ├── random.cairo
│   │   └── scoring.cairo
│   └── tests/               # Test suite
├── scripts/
│   └── deploy.sh            # Deployment script
└── Scarb.toml               # Project configuration
```

## 🚀 Getting Started

### Prerequisites

1. **Install Dojo** (v1.0.0-alpha.6 or later)
   ```bash
   curl -L https://install.dojoengine.org | bash
   dojoup
   ```

2. **Install Scarb** (Cairo package manager)
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh
   ```

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd memorabilia
   ```

2. Build the project:
   ```bash
   sozo build
   ```

3. Run tests:
   ```bash
   sozo test
   ```

### Local Development

1. Start a local Katana node (Starknet devnet):
   ```bash
   katana --disable-fee
   ```

2. In another terminal, deploy the contracts:
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh katana
   ```

3. Note the world address from the deployment output

## 🎯 How to Play

### Game Flow

1. **Register Account**: Authenticate via Telegram and create on-chain account
2. **Start Game**: Choose difficulty level (Easy/Medium/Hard)
3. **Play**: Flip cards to find matching pairs
4. **Win**: Match all pairs to complete the game
5. **Compete**: Your score is submitted to the global leaderboard

### Scoring System

Your score is calculated based on:
- **Base Score**: 10,000 points
- **Difficulty Multiplier**: 
  - Easy: 10x (1,000 bonus)
  - Medium: 15x (1,500 bonus)
  - Hard: 20x (2,000 bonus)
- **Time Bonus**: Faster completion = higher score
- **Move Penalty**: Extra moves reduce your score

**Star Ratings**:
- ⭐⭐⭐ 3 Stars: Within 10% of optimal moves
- ⭐⭐ 2 Stars: Within 50% of optimal moves
- ⭐ 1 Star: Completed

## 📝 Smart Contract Interactions

### Account Registry

```cairo
// Register new account
register_account(telegram_id, owner_public_key, session_public_key) -> ContractAddress

// Update session key
update_session_key(telegram_id, new_session_key)

// Get account info
get_account(telegram_id) -> UserAccount
```

### Game System

```cairo
// Start new game
start_game(difficulty: u8) -> u32  // Returns game_id

// Flip a card
flip_card(game_id: u32, card_index: u8)

// Check if flipped cards match
check_match(game_id: u32) -> bool

// Get game state
get_game(game_id: u32) -> GameState

// Abandon game
abandon_game(game_id: u32)
```

### Leaderboard System

```cairo
// Submit score after game completion
submit_score(game_id, telegram_id, score, difficulty, moves, time)

// Get leaderboard entry by rank
get_leaderboard_entry(rank: u32) -> LeaderboardEntry

// Get player statistics
get_player_stats(player: ContractAddress) -> PlayerStats

// Get player's current rank
get_player_rank(player: ContractAddress) -> u32
```

### Greeting System (Demo)

```cairo
// Set greeting message (gasless transaction demo)
set_greeting(message: ByteArray)

// Get greeting
get_greeting(user: ContractAddress) -> ByteArray
```

## 🧪 Testing

Run the full test suite:
```bash
sozo test
```

Run specific test file:
```bash
sozo test test_game_system
```

### Test Coverage

- ✅ Game System: Start game, flip cards, match checking, win conditions
- ✅ Account Registry: Registration, session keys, policies
- ✅ Leaderboard: Score submission, rankings, player stats
- ✅ Utilities: Card generation, shuffling, scoring

## 🔐 Account Abstraction & Session Keys

Memorabilia uses Account Abstraction to provide a seamless user experience:

1. **Telegram Authentication**: Users authenticate via Telegram
2. **Account Creation**: On-chain account is created automatically
3. **Session Keys**: Temporary keys for gasless transactions
4. **Session Policies**: Define allowed contracts and methods
5. **Gasless Gaming**: Players don't need to manage gas fees

## 🌐 Deployment

### Deploy to Katana (Local)
```bash
./scripts/deploy.sh katana
```

### Deploy to Testnet
```bash
./scripts/deploy.sh sepolia
```

### Deploy to Mainnet
```bash
./scripts/deploy.sh mainnet
```

## 📊 Models

### UserAccount
- Telegram ID (key)
- Owner public key
- Session public key
- Account address
- Activity tracking
- Game statistics

### GameState
- Game ID (key)
- Player address
- Difficulty level
- Card array
- Match tracking
- Score and timing

### Card
- Card ID
- Value (for matching)
- Flip state
- Match state
- Position

### LeaderboardEntry
- Rank (key)
- Player info
- Score details
- Game metadata

### PlayerStats
- Total games
- Win statistics
- Best scores
- Performance metrics

## 🛠️ Development

### Project Structure

- **Models**: Define data structures stored on-chain
- **Systems**: Smart contracts containing game logic
- **Utils**: Helper functions for calculations
- **Tests**: Comprehensive test coverage

### Adding New Features

1. Define models in `src/models/`
2. Implement systems in `src/systems/`
3. Add utilities in `src/utils/`
4. Write tests in `src/tests/`
5. Update `src/lib.cairo` to include new modules

## 📚 Resources

- [Dojo Book](https://book.dojoengine.org/)
- [Cairo Documentation](https://book.cairo-lang.org/)
- [Starknet Documentation](https://docs.starknet.io/)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🎯 Roadmap

- [x] Sprint 1: Account Abstraction & Authentication
- [x] Sprint 2: Core Game Logic
- [x] Sprint 3: Leaderboard System
- [ ] Sprint 4: Telegram Mini App Integration
- [ ] Sprint 5: Advanced Features (Power-ups, Tournaments)
- [ ] Sprint 6: NFT Rewards & Achievements

## 💡 Future Enhancements

- **NFT Rewards**: Mint NFTs for achievements
- **Tournaments**: Competitive events with prizes
- **Power-ups**: Special abilities during gameplay
- **Social Features**: Challenge friends, share scores
- **Multiple Themes**: Different card designs
- **Daily Challenges**: Special game modes

---

Built with ❤️ using Dojo on Starknet

