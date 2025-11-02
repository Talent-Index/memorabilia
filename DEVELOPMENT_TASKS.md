# 🛠️ Development Tasks - Memorabilia

## Overview
This document contains all development tasks for integrating Memorabilia with Dojo blockchain and Telegram Mini Apps. Each task includes clear acceptance criteria and deliverables.

---

## 📋 Task Status Legend

- [ ] **NOT STARTED** - Task not yet begun
- [/] **IN PROGRESS** - Currently being worked on
- [x] **COMPLETE** - Task finished and verified
- [-] **BLOCKED** - Waiting on dependencies

---

## Task 1: Contracts Build & Test - Cairo

### 🎯 Objective
Ensure all Cairo smart contracts compile successfully and pass all unit tests.

### 📝 Description
Build and test all Dojo smart contracts for the Memorabilia game. Fix any compilation errors or test failures.

### 🔧 Commands
```bash
cd /home/daniel/Documents/augment-projects/Memorabilia

# Clean previous builds
sozo clean

# Build contracts
sozo build

# Run all tests
sozo test

# Run specific test
sozo test test_start_game
sozo test test_flip_card
sozo test test_check_match
```

### ✅ Acceptance Criteria
- [ ] `sozo build` completes without errors
- [ ] All Dojo unit tests pass (100% pass rate)
- [ ] No compilation warnings or errors
- [ ] Test output shows all assertions passing

### 📦 Deliverables
- [ ] Screenshot of successful `sozo build` output
- [ ] Screenshot of all tests passing
- [ ] List of any fixes made (if errors were found)

### 📊 Verification
```bash
# Expected output:
✓ Compiling...
✓ Building contracts...
✓ Build complete!

# Test output should show:
test test_start_game ... ok
test test_flip_card ... ok
test test_check_match ... ok
test test_abandon_game ... ok
test test_leaderboard ... ok
```

### 🔗 Dependencies
- None (can start immediately)

### ⏱️ Estimated Time
- 30 minutes - 1 hour

---

## Task 2: Telegram Mini App Integration

### 🎯 Objective
Integrate the game with Telegram Mini Apps and verify it works inside Telegram.

### 📝 Description
Expose the local development server using ngrok, configure the Telegram bot to use the ngrok URL, and test the game inside Telegram.

### 🔧 Commands
```bash
# Terminal 1: Start frontend dev server
cd /home/daniel/Documents/augment-projects/Memorabilia/frontend
npm run dev
# Should run on http://localhost:5173

# Terminal 2: Start ngrok
ngrok http 5173
# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

### 📱 Telegram Bot Configuration
1. Open Telegram and search for `@BotFather`
2. Send `/myapps`
3. Select your bot (or create new with `/newbot`)
4. Edit Web App URL
5. Paste ngrok HTTPS URL
6. Save changes

### 🧪 Testing Steps
1. Open Telegram
2. Search for your bot
3. Click "Start" or menu button
4. Mini App should open inside Telegram
5. Check browser console for Telegram WebApp detection
6. Try starting a game
7. Verify game works inside Telegram

### ✅ Acceptance Criteria
- [ ] ngrok successfully exposes local server
- [ ] Telegram bot Web App URL updated with ngrok URL
- [ ] Mini App opens inside Telegram (not external browser)
- [ ] Console shows: `"Telegram WebApp detected"`
- [ ] Console shows Telegram user data (id, username, etc.)
- [ ] Game is playable inside Telegram
- [ ] If in blockchain mode, transactions work from Telegram

### 📦 Deliverables
- [ ] Screenshot of ngrok running with HTTPS URL
- [ ] Screenshot of BotFather configuration
- [ ] Screenshot of game running inside Telegram
- [ ] Screenshot of browser console showing Telegram detection
- [ ] Share link to Telegram bot for testing

### 📊 Verification
Check console output:
```javascript
// Should see:
🎮 Telegram WebApp detected
User: { id: 123456, first_name: "...", username: "..." }
Theme: { bg_color: "#ffffff", ... }
```

### 🔗 Dependencies
- Task 1 (contracts must build)
- Frontend must be running

### ⏱️ Estimated Time
- 30 minutes - 1 hour

### 📚 References
- [Telegram Mini Apps Docs](https://core.telegram.org/bots/webapps)
- [ngrok Documentation](https://ngrok.com/docs)

---

## Task 3: Local Deployment & Indexer

### 🎯 Objective
Deploy contracts to local Katana node and start Torii indexer for blockchain queries.

### 📝 Description
Start Katana (local Starknet node), deploy contracts using Sozo, and start Torii indexer to index blockchain events.

### 🔧 Commands

#### Terminal 1: Start Katana
```bash
cd /home/daniel/Documents/augment-projects/Memorabilia

katana --disable-fee --allowed-origins "*"

# Keep this terminal running!
# Note the prefunded accounts and addresses
```

#### Terminal 2: Deploy Contracts
```bash
cd /home/daniel/Documents/augment-projects/Memorabilia

# Build first (if not done in Task 1)
sozo build

# Deploy to Katana
sozo migrate apply

# IMPORTANT: Copy the World address from output!
# Example: World address: 0x1234567890abcdef...
```

#### Terminal 3: Start Torii Indexer
```bash
cd /home/daniel/Documents/augment-projects/Memorabilia

# Replace <WORLD_ADDRESS> with actual address from deployment
torii --world <WORLD_ADDRESS> \
      --rpc http://localhost:5050 \
      --allowed-origins "*"

# Keep this terminal running!
# Should listen on http://localhost:8080
```

### ✅ Acceptance Criteria
- [ ] Katana is running on `http://localhost:5050`
- [ ] Katana shows prefunded accounts in output
- [ ] `sozo migrate apply` completes successfully
- [ ] World address is captured and saved
- [ ] Torii indexer is running on `http://localhost:8080`
- [ ] Torii successfully connects to Katana
- [ ] Torii indexes the deployed world

### 📦 Deliverables
- [ ] Screenshot of Katana running with prefunded accounts
- [ ] Screenshot of successful deployment with World address
- [ ] Screenshot of Torii indexer running
- [ ] **World address posted** (to be shared with frontend team)
- [ ] Update `frontend/.env.local` with World address

### 📊 Verification

**Katana Output:**
```
PREFUNDED ACCOUNTS
==================
Account #0: 0x...
Private Key: 0x...

LISTENING ON: http://0.0.0.0:5050
```

**Deployment Output:**
```
Migration successful!

World address: 0x1234567890abcdef...
```

**Torii Output:**
```
Torii indexer started
Listening on http://0.0.0.0:8080
Indexing world: 0x1234567890abcdef...
```

### 🔧 Update Frontend Environment
```bash
cd frontend

# Create or update .env.local
cat > .env.local << EOF
VITE_RPC_URL=http://localhost:5050
VITE_TORII_URL=http://localhost:8080
VITE_WORLD_ADDRESS=0x<YOUR_WORLD_ADDRESS>
VITE_ENV=development
VITE_NETWORK=katana
EOF
```

### 🔗 Dependencies
- Task 1 (contracts must build successfully)

### ⏱️ Estimated Time
- 30 minutes - 1 hour

### 🐛 Troubleshooting
- **Katana fails to start:** Check if port 5050 is already in use (`lsof -i :5050`)
- **Deployment fails:** Run `sozo clean && sozo build` first
- **Torii fails to start:** Verify World address is correct, check port 8080

---

## Task 4: Frontend Blockchain Integration & Burner Account Flow

### 🎯 Objective
Verify frontend connects to blockchain, creates burner accounts, and executes transactions.

### 📝 Description
Test the complete Dojo integration flow: setup → burner account creation → game controller → transactions.

### 🔧 Commands
```bash
cd /home/daniel/Documents/augment-projects/Memorabilia/frontend

# Install dependencies (if needed)
npm ci

# Start development server
npm run dev

# Open http://localhost:5173 in browser
```

### 🧪 Testing Flow

1. **Open Browser Console** (F12)
2. **Check Initialization:**
   - Should see: `"⛓️ Running in BLOCKCHAIN MODE"`
   - Should see: `"✅ Blockchain initialization complete!"`
3. **Check Burner Account:**
   - Should see burner account address
   - Should see account balance
4. **Start a Game:**
   - Select difficulty (Easy/Medium/Hard)
   - Click "Start Game"
   - Should see transaction hash in console
   - Should see game ID returned
5. **Flip Cards:**
   - Click on cards
   - Each flip should create a transaction
   - Check Torii for events
6. **Check Torii Events:**
   - Open http://localhost:8080/graphql
   - Query for GameStarted, CardFlipped events

### ✅ Acceptance Criteria
- [ ] Frontend boots without errors
- [ ] Console shows `"⛓️ Running in BLOCKCHAIN MODE"`
- [ ] Console shows `"✅ Blockchain initialization complete!"`
- [ ] Burner account is created successfully
- [ ] Starting a game triggers a transaction
- [ ] Transaction hash is logged in console
- [ ] Game ID is returned and displayed
- [ ] Card flips create transactions
- [ ] Torii shows events for GameStarted and CardFlipped
- [ ] No errors in browser console

### 📦 Deliverables
- [ ] Screenshot of console showing blockchain mode
- [ ] Screenshot of successful game start transaction
- [ ] Screenshot of Torii events (GraphQL query result)
- [ ] Short screen recording (30-60 seconds) showing:
  - Frontend loading
  - Game start
  - Card flip
  - Console logs
- [ ] Console logs exported to file

### 📊 Verification

**Expected Console Output:**
```javascript
⛓️ Running in BLOCKCHAIN MODE
🔧 Initializing Dojo...
✅ Burner account created: 0x...
✅ Blockchain initialization complete!

🎮 Starting game on blockchain
⛓️ Transaction hash: 0x...
✅ Game started with ID: 12345

🎴 Flipping card at index 0
⛓️ Transaction hash: 0x...
✅ Card flipped

🎯 Checking match...
⛓️ Transaction hash: 0x...
✅ Match found!
```

**Torii GraphQL Query:**
```graphql
query {
  events(first: 10) {
    edges {
      node {
        keys
        data
        transactionHash
      }
    }
  }
}
```

### 🔗 Dependencies
- Task 3 (Katana and Torii must be running)
- World address must be set in `.env.local`

### ⏱️ Estimated Time
- 1-2 hours

### 🐛 Troubleshooting
- **Stuck on loading:** Check Katana is running, verify World address
- **Transaction fails:** Check burner account has funds (Katana prefunds)
- **No events in Torii:** Verify Torii is indexing correct World address

---

## Task 5: Dojo-Telegram SDK Prototype

### 🎯 Objective
Create a minimal, reusable SDK package for Dojo + Telegram integration.

### 📝 Description
Build a prototype SDK that handles Telegram authentication and Dojo blockchain interactions. This will be a standalone npm package.

### 🏗️ Project Structure
```
dojo-telegram-sdk/
├── package.json
├── tsconfig.json
├── README.md
├── src/
│   ├── index.ts              # Main exports
│   ├── auth.ts               # Telegram auth helper
│   ├── dojoClient.ts         # Dojo client wrapper
│   └── types.ts              # TypeScript types
├── examples/
│   └── usage.ts              # Example usage
└── tests/
    └── auth.test.ts          # Basic tests
```

### 🔧 Implementation Steps

#### Step 1: Initialize Package
```bash
cd /home/daniel/Documents/augment-projects/Memorabilia

# Create SDK directory
mkdir dojo-telegram-sdk
cd dojo-telegram-sdk

# Initialize package
npm init -y

# Install dependencies
npm install starknet @dojoengine/core @dojoengine/torii-client
npm install -D typescript @types/node vitest

# Initialize TypeScript
npx tsc --init
```

#### Step 2: Create Core Files

**package.json:**
```json
{
  "name": "@memorabilia/dojo-telegram-sdk",
  "version": "0.1.0",
  "description": "Telegram Mini Apps SDK for Dojo games",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "dev": "tsc --watch"
  },
  "keywords": ["dojo", "telegram", "starknet", "web3"],
  "license": "MIT"
}
```

**src/auth.ts:**
```typescript
/**
 * Telegram authentication helper
 * Validates initData and parses user information
 */

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export class TelegramAuth {
  /**
   * Parse Telegram WebApp initData
   */
  static parseInitData(initData: string): TelegramUser | null {
    try {
      const params = new URLSearchParams(initData);
      const userStr = params.get('user');
      if (!userStr) return null;
      
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Failed to parse Telegram initData:', error);
      return null;
    }
  }

  /**
   * Validate initData hash (basic validation)
   */
  static validateInitData(initData: string, botToken: string): boolean {
    // TODO: Implement HMAC validation
    // See: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
    return true; // Placeholder
  }

  /**
   * Get current Telegram user
   */
  static getCurrentUser(): TelegramUser | null {
    if (typeof window === 'undefined') return null;
    
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return null;

    return tg.initDataUnsafe?.user || null;
  }
}
```

**src/dojoClient.ts:**
```typescript
/**
 * Dojo client wrapper for game interactions
 */

import { Account, RpcProvider } from 'starknet';

export interface DojoConfig {
  worldAddress: string;
  rpcUrl: string;
  toriiUrl?: string;
}

export class DojoClient {
  private provider: RpcProvider;
  private worldAddress: string;
  private account: Account | null = null;

  constructor(config: DojoConfig) {
    this.worldAddress = config.worldAddress;
    this.provider = new RpcProvider({ nodeUrl: config.rpcUrl });
  }

  /**
   * Connect with an account (e.g., burner account)
   */
  connect(account: Account) {
    this.account = account;
  }

  /**
   * Execute a contract call
   */
  async execute(system: string, method: string, calldata: any[]) {
    if (!this.account) {
      throw new Error('Account not connected. Call connect() first.');
    }

    const tx = await this.account.execute({
      contractAddress: this.worldAddress,
      entrypoint: method,
      calldata,
    });

    await this.provider.waitForTransaction(tx.transaction_hash);
    return tx;
  }

  /**
   * Start a new game
   */
  async startGame(difficulty: number) {
    return this.execute('game_system', 'start_game', [difficulty]);
  }

  /**
   * Flip a card
   */
  async flipCard(gameId: number, cardIndex: number) {
    return this.execute('game_system', 'flip_card', [gameId, cardIndex]);
  }

  /**
   * Check if cards match
   */
  async checkMatch(gameId: number) {
    return this.execute('game_system', 'check_match', [gameId]);
  }
}
```

**src/index.ts:**
```typescript
export { TelegramAuth, type TelegramUser } from './auth';
export { DojoClient, type DojoConfig } from './dojoClient';
```

**examples/usage.ts:**
```typescript
import { TelegramAuth, DojoClient } from '../src';
import { Account } from 'starknet';

// Example: Using the SDK

async function main() {
  // 1. Get Telegram user
  const user = TelegramAuth.getCurrentUser();
  console.log('Telegram user:', user);

  // 2. Create Dojo client
  const dojo = new DojoClient({
    worldAddress: '0x...',
    rpcUrl: 'http://localhost:5050',
  });

  // 3. Connect with burner account (from frontend)
  const burnerAccount = new Account(/* ... */);
  dojo.connect(burnerAccount);

  // 4. Start a game
  const tx = await dojo.startGame(0); // Easy difficulty
  console.log('Game started:', tx.transaction_hash);

  // 5. Flip a card
  await dojo.flipCard(1, 0); // gameId=1, cardIndex=0
  console.log('Card flipped!');
}

main().catch(console.error);
```

**README.md:**
```markdown
# Dojo Telegram SDK

Minimal SDK for integrating Dojo games with Telegram Mini Apps.

## Installation

\`\`\`bash
npm install @memorabilia/dojo-telegram-sdk
\`\`\`

## Usage

\`\`\`typescript
import { TelegramAuth, DojoClient } from '@memorabilia/dojo-telegram-sdk';

// Get Telegram user
const user = TelegramAuth.getCurrentUser();

// Create Dojo client
const dojo = new DojoClient({
  worldAddress: '0x...',
  rpcUrl: 'http://localhost:5050',
});

// Connect account and start game
dojo.connect(burnerAccount);
await dojo.startGame(0);
\`\`\`

## API Reference

See [TELEGRAM_SDK_PLAN.md](../TELEGRAM_SDK_PLAN.md) for full implementation details.
```

### 🔧 Build Commands
```bash
cd dojo-telegram-sdk

# Install dependencies
npm ci

# Build
npm run build

# Test (if tests exist)
npm test
```

### ✅ Acceptance Criteria
- [ ] Package structure created with all required files
- [ ] `package.json` configured correctly
- [ ] `tsconfig.json` configured for TypeScript compilation
- [ ] `src/auth.ts` implements Telegram authentication
- [ ] `src/dojoClient.ts` implements Dojo interactions
- [ ] `src/index.ts` exports all public APIs
- [ ] `examples/usage.ts` shows how to use the SDK
- [ ] `README.md` documents installation and usage
- [ ] `npm ci && npm run build` completes successfully
- [ ] TypeScript compiles without errors
- [ ] Example usage successfully calls `start_game` (or mocked)

### 📦 Deliverables
- [ ] Complete SDK package in `dojo-telegram-sdk/` directory
- [ ] All source files committed to repository
- [ ] README with usage examples
- [ ] Screenshot of successful build
- [ ] Example usage file that demonstrates SDK

### 📊 Verification
```bash
# Should output compiled JavaScript
ls dist/
# Expected: index.js, auth.js, dojoClient.js, index.d.ts, etc.

# Should show no TypeScript errors
npm run build
# Expected: ✓ Compiled successfully
```

### 🔗 Dependencies
- Task 4 (need burner account flow working)
- Understanding of Dojo client patterns

### ⏱️ Estimated Time
- 2-3 hours

### 📚 References
- [Official Dojo Telegram Integration](https://dojoengine.org/client/sdk/telegram#dojo-telegram-integration)
- [TELEGRAM_SDK_PLAN.md](./TELEGRAM_SDK_PLAN.md)

---

## Task 6: QA, Documentation, Demo Recording & Release Notes

### 🎯 Objective
Create comprehensive documentation, demo video, and pitch deck for the project.

### 📝 Description
Quality assurance, documentation, demo recording, and preparing release materials.

### 🎬 Demo Recording (2-3 minutes)

#### Recording Checklist
- [ ] Screen recording software ready (OBS, QuickTime, etc.)
- [ ] All terminals ready (Katana, Torii, Frontend)
- [ ] Browser with console open
- [ ] Telegram app ready

#### Demo Script
1. **Introduction (15 seconds)**
   - "Welcome to Memorabilia - an on-chain memory card game"
   - Show project overview

2. **Backend Setup (30 seconds)**
   - Show Katana running
   - Show deployment output with World address
   - Show Torii indexer running

3. **Frontend Demo (60 seconds)**
   - Open browser to http://localhost:5173
   - Show console: "Blockchain mode"
   - Start a game
   - Show transaction hash
   - Flip some cards
   - Show match detection
   - Show Torii events

4. **Telegram Integration (30 seconds)**
   - Open Telegram
   - Launch Mini App
   - Show game running inside Telegram
   - Show Telegram user detection

5. **Conclusion (15 seconds)**
   - Recap features
   - Show next steps

### 📊 Pitch Deck

#### Slide Structure (10-12 slides)

**Slide 1: Title**
- Memorabilia: On-Chain Memory Game
- Built with Dojo on Starknet
- Telegram Mini App Integration

**Slide 2: Problem**
- Web3 gaming needs better UX
- High gas fees prevent casual gaming
- Complex wallet setup barriers

**Slide 3: Solution**
- Gasless gameplay with session keys
- Burner accounts (no wallet needed)
- Telegram integration (2B+ users)

**Slide 4: Game Features**
- 3 difficulty levels
- Beautiful animations
- Sound effects
- Score tracking
- Global leaderboard

**Slide 5: Technical Stack**
- **Frontend:** React, TypeScript, Vite, Tailwind
- **Blockchain:** Dojo, Cairo, Starknet
- **Integration:** Telegram Mini Apps SDK
- **Indexer:** Torii (GraphQL)

**Slide 6: Architecture**
```
Telegram Mini App
       ↓
  React Frontend
       ↓
  Dojo SDK (Custom)
       ↓
  Starknet (Dojo World)
```

**Slide 7: Smart Contracts**
- Game System (start, flip, match)
- Leaderboard System
- Account Management
- Session Key Policies

**Slide 8: Key Innovations**
- Account abstraction
- Session keys (gasless)
- Telegram CloudStorage
- Real-time indexing

**Slide 9: Demo Screenshots**
- Game UI
- Telegram integration
- Blockchain transactions
- Leaderboard

**Slide 10: Roadmap**
- ✅ Phase 1: Core game
- ✅ Phase 2: Blockchain integration
- 🔄 Phase 3: Telegram SDK
- 📅 Phase 4: Testnet launch
- 📅 Phase 5: Mainnet + tournaments

**Slide 11: Metrics & Goals**
- 10,000+ users in first month
- 1,000+ daily active users
- Featured in Telegram
- Community tournaments

**Slide 12: Team & Contact**
- Team members
- GitHub repository
- Telegram community
- Contact information

### 📝 Documentation Tasks

#### Update Existing Docs
- [ ] Update README.md with latest features
- [ ] Update PLAY_GUIDE.md with Telegram instructions
- [ ] Update DEPLOYMENT_GUIDE.md with actual deployment steps
- [ ] Create TROUBLESHOOTING.md with common issues

#### Create New Docs
- [ ] API_REFERENCE.md for SDK
- [ ] CONTRIBUTING.md for developers
- [ ] CHANGELOG.md with version history
- [ ] SECURITY.md with security practices

### 🐛 QA Testing Checklist

#### Functional Testing
- [ ] All game difficulties work
- [ ] Card matching logic correct
- [ ] Score calculation accurate
- [ ] Leaderboard updates properly
- [ ] Sound effects play correctly
- [ ] Animations smooth

#### Blockchain Testing
- [ ] Transactions succeed
- [ ] Events indexed correctly
- [ ] Burner accounts work
- [ ] Session keys function
- [ ] Gas fees are zero

#### Telegram Testing
- [ ] Mini App opens correctly
- [ ] User authentication works
- [ ] CloudStorage saves data
- [ ] Haptic feedback works
- [ ] Theme colors applied

#### Cross-Platform Testing
- [ ] Works on iOS Telegram
- [ ] Works on Android Telegram
- [ ] Works on Desktop Telegram
- [ ] Works on Web Telegram

### ✅ Acceptance Criteria
- [ ] 2-3 minute demo video recorded and edited
- [ ] Demo shows all key features working
- [ ] Pitch deck created (10-12 slides)
- [ ] Pitch deck covers all technical aspects
- [ ] All documentation updated
- [ ] QA testing completed with no critical bugs
- [ ] Release notes drafted

### 📦 Deliverables
- [ ] Demo video (MP4, 1080p, 2-3 minutes)
- [ ] Pitch deck (PDF + PowerPoint/Google Slides)
- [ ] Updated documentation (all .md files)
- [ ] QA test report
- [ ] Release notes (CHANGELOG.md)
- [ ] Screenshots for marketing

### 📊 Release Notes Template

```markdown
# Memorabilia v1.0.0 - Initial Release

## 🎉 Features

### Game
- Memory card matching game with 3 difficulty levels
- Beautiful 3D card flip animations
- 24 unique emoji icons
- Sound effects (flip, match, mismatch, victory)
- Score calculation with star ratings
- Win detection with confetti celebration

### Blockchain
- Fully on-chain game state
- Dojo framework integration
- Burner account creation
- Session keys for gasless gameplay
- Real-time event indexing with Torii
- Global leaderboard

### Telegram
- Telegram Mini App integration
- User authentication
- CloudStorage for progress
- Haptic feedback
- Theme customization

## 🛠️ Technical Stack
- Frontend: React 18, TypeScript, Vite, Tailwind CSS
- Blockchain: Dojo v1.0.0-alpha.6, Cairo, Starknet
- Integration: Telegram Mini Apps SDK
- Indexer: Torii (GraphQL)

## 📚 Documentation
- Complete setup guides
- API reference
- Deployment instructions
- Troubleshooting guide

## 🐛 Known Issues
- None (or list any known issues)

## 🔜 Upcoming Features
- Multiplayer mode
- Daily tournaments
- NFT rewards
- Custom card themes
- Friend challenges
```

### 🔗 Dependencies
- All previous tasks (1-5) must be complete

### ⏱️ Estimated Time
- 3-4 hours

---

## 📊 Overall Progress Tracker

| Task | Status | Assignee | Estimated Time | Actual Time |
|------|--------|----------|----------------|-------------|
| Task 1: Contracts Build & Test | [ ] | - | 30-60 min | - |
| Task 2: Telegram Integration | [ ] | - | 30-60 min | - |
| Task 3: Local Deployment | [ ] | - | 30-60 min | - |
| Task 4: Frontend Integration | [ ] | - | 1-2 hours | - |
| Task 5: SDK Prototype | [ ] | - | 2-3 hours | - |
| Task 6: QA & Documentation | [ ] | - | 3-4 hours | - |
| **Total** | **0/6** | - | **8-12 hours** | - |

---

## 🚀 Getting Started

### For Developers

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Memorabilia
   ```

2. **Read the Git Workflow** - See [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)

3. **Choose a task** from the list above

4. **Check dependencies** - ensure prerequisite tasks are complete

5. **Follow the task instructions** step by step

6. **Mark acceptance criteria** as you complete them

7. **Submit deliverables** when done

### Task Assignment

To claim a task:
1. Update the "Assignee" column with your name
2. Change status to [/] IN PROGRESS
3. Create a branch following naming convention: `feature/<yourName>-<taskShortName>`
   - Example: `feature/alex-cairo-build-tests`
4. Complete the task following [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
5. Submit PR using the PR template (auto-populated on GitHub)
6. Get review and approval
7. Merge using "Squash and merge"
8. Update status to [x] COMPLETE

### Git Workflow Quick Reference

```bash
# 1. Update main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/<yourName>-<taskShortName>

# 3. Work and commit
git add .
git commit -m "feat: your changes"

# 4. Rebase before pushing
git fetch origin
git rebase origin/main

# 5. Push and create PR
git push -u origin feature/<yourName>-<taskShortName>

# 6. After merge
git checkout main
git pull origin main
git branch -d feature/<yourName>-<taskShortName>
```

**Full workflow details:** [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)

---

## 📞 Support

### Questions?
- Check the relevant guide (BLOCKCHAIN_INTEGRATION_PLAN.md, TELEGRAM_SDK_PLAN.md)
- Review TROUBLESHOOTING.md
- Ask in team chat
- Check Dojo Discord

### Issues?
- Document the error
- Check logs (Katana, Torii, browser console)
- Try troubleshooting steps
- Report if unresolved

---

## 📚 Related Documentation

### Workflow & Process
- **[GIT_WORKFLOW.md](./GIT_WORKFLOW.md)** - Team Git workflow and branching strategy
- **[.github/PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md)** - PR template (auto-populated)

### Implementation Guides
- **[BLOCKCHAIN_INTEGRATION_PLAN.md](./BLOCKCHAIN_INTEGRATION_PLAN.md)** - Dojo blockchain integration
- **[TELEGRAM_SDK_PLAN.md](./TELEGRAM_SDK_PLAN.md)** - Telegram SDK development
- **[IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)** - 3-week deployment plan
- **[NEXT_STEPS.md](./NEXT_STEPS.md)** - Quick start guide

### Reference
- **[README.md](./README.md)** - Project overview
- **[COMPLETE_GUIDE.md](./COMPLETE_GUIDE.md)** - Comprehensive guide
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deployment instructions
- **[PLAY_GUIDE.md](./PLAY_GUIDE.md)** - How to play the game

---

## ✅ Final Checklist

Before marking project complete:
- [ ] All 6 tasks completed
- [ ] All acceptance criteria met
- [ ] All deliverables submitted
- [ ] All PRs merged to `main`
- [ ] Demo video recorded
- [ ] Pitch deck created
- [ ] Documentation updated
- [ ] QA testing passed
- [ ] Ready for testnet deployment

---

**Let's build something amazing! 🚀**

**Remember:** Follow [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) for all contributions!

