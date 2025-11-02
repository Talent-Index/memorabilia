# 📱 Telegram SDK Implementation Plan - Dojo Telegram Mini Apps

## Overview
This document outlines how to build a complete Telegram SDK for Dojo games, enabling seamless integration between Telegram Mini Apps and Dojo blockchain.

---

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Phase 1: Telegram Bot Setup](#phase-1-telegram-bot-setup)
3. [Phase 2: SDK Core Development](#phase-2-sdk-core-development)
4. [Phase 3: Dojo Integration](#phase-3-dojo-integration)
5. [Phase 4: Account Abstraction](#phase-4-account-abstraction)
6. [Phase 5: Testing & Deployment](#phase-5-testing--deployment)
7. [Phase 6: Publishing SDK](#phase-6-publishing-sdk)

---

## Architecture Overview

### Components
```
┌─────────────────────────────────────────────────────────┐
│                  TELEGRAM MINI APP                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │         React Frontend (Memorabilia)              │  │
│  └────────────────────┬─────────────────────────────┘  │
│                       │                                  │
│  ┌────────────────────▼─────────────────────────────┐  │
│  │         Dojo Telegram SDK (NEW)                   │  │
│  │  ┌──────────────┐  ┌──────────────┐              │  │
│  │  │   Auth       │  │   Wallet     │              │  │
│  │  └──────────────┘  └──────────────┘              │  │
│  │  ┌──────────────┐  ┌──────────────┐              │  │
│  │  │  Session     │  │   Storage    │              │  │
│  │  └──────────────┘  └──────────────┘              │  │
│  └────────────────────┬─────────────────────────────┘  │
└───────────────────────┼──────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
│   Telegram   │ │    Dojo     │ │  Starknet  │
│   Backend    │ │   Torii     │ │    RPC     │
└──────────────┘ └─────────────┘ └────────────┘
```

---

## Phase 1: Telegram Bot Setup

### Step 1.1: Create Telegram Bot
**Time Estimate:** 5 minutes

1. **Open Telegram** and search for `@BotFather`

2. **Create new bot:**
```
/newbot
```

3. **Follow prompts:**
```
Name: Memorabilia Game
Username: memorabilia_game_bot
```

4. **Save the token:**
```
Token: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

5. **Enable Mini App:**
```
/newapp
Select your bot: @memorabilia_game_bot
Title: Memorabilia
Description: On-chain memory card game
Photo: Upload game icon
Web App URL: https://your-app.vercel.app
```

### Step 1.2: Configure Bot Settings

```
# Enable inline mode
/setinline
@memorabilia_game_bot
Play Memorabilia

# Set commands
/setcommands
@memorabilia_game_bot

Commands:
start - Start playing Memorabilia
help - How to play
stats - View your statistics
leaderboard - Global rankings
```

### Step 1.3: Test Bot

```
# In Telegram, search for your bot
@memorabilia_game_bot

# Click "Start"
# Should open your Mini App
```

---

## Phase 2: SDK Core Development

### Step 2.1: Create SDK Package Structure

```bash
mkdir dojo-telegram-sdk
cd dojo-telegram-sdk

# Initialize package
npm init -y

# Setup TypeScript
npm install -D typescript @types/node
npx tsc --init
```

**Directory Structure:**
```
dojo-telegram-sdk/
├── src/
│   ├── index.ts                 # Main export
│   ├── auth/
│   │   ├── TelegramAuth.ts      # Telegram authentication
│   │   └── SessionManager.ts    # Session management
│   ├── wallet/
│   │   ├── BurnerWallet.ts      # Burner wallet creation
│   │   ├── SessionKeys.ts       # Session key management
│   │   └── AccountAbstraction.ts # AA implementation
│   ├── dojo/
│   │   ├── DojoClient.ts        # Dojo connection
│   │   ├── GameController.ts    # Game interactions
│   │   └── QueryBuilder.ts      # Torii queries
│   ├── storage/
│   │   ├── TelegramStorage.ts   # CloudStorage API
│   │   └── LocalStorage.ts      # Fallback storage
│   ├── utils/
│   │   ├── crypto.ts            # Cryptographic utilities
│   │   ├── validation.ts        # Input validation
│   │   └── errors.ts            # Error handling
│   └── types/
│       ├── telegram.ts          # Telegram types
│       ├── dojo.ts              # Dojo types
│       └── index.ts             # Type exports
├── tests/
│   ├── auth.test.ts
│   ├── wallet.test.ts
│   └── integration.test.ts
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

### Step 2.2: Implement Core SDK

**src/index.ts:**
```typescript
export { DojoTelegramSDK } from './DojoTelegramSDK';
export * from './types';
export * from './auth';
export * from './wallet';
export * from './dojo';
export * from './storage';
```

**src/DojoTelegramSDK.ts:**
```typescript
import { TelegramAuth } from './auth/TelegramAuth';
import { BurnerWallet } from './wallet/BurnerWallet';
import { DojoClient } from './dojo/DojoClient';
import { TelegramStorage } from './storage/TelegramStorage';

export interface SDKConfig {
  telegramBotToken: string;
  dojoWorldAddress: string;
  rpcUrl: string;
  toriiUrl: string;
  network: 'katana' | 'sepolia' | 'mainnet';
}

export class DojoTelegramSDK {
  private auth: TelegramAuth;
  private wallet: BurnerWallet;
  private dojo: DojoClient;
  private storage: TelegramStorage;

  constructor(config: SDKConfig) {
    this.auth = new TelegramAuth(config.telegramBotToken);
    this.wallet = new BurnerWallet();
    this.dojo = new DojoClient({
      worldAddress: config.dojoWorldAddress,
      rpcUrl: config.rpcUrl,
      toriiUrl: config.toriiUrl,
    });
    this.storage = new TelegramStorage();
  }

  async initialize() {
    // 1. Authenticate with Telegram
    const telegramUser = await this.auth.authenticate();
    
    // 2. Get or create burner wallet
    const wallet = await this.wallet.getOrCreate(telegramUser.id);
    
    // 3. Setup session keys
    await this.wallet.setupSessionKeys();
    
    // 4. Connect to Dojo
    await this.dojo.connect(wallet);
    
    return {
      user: telegramUser,
      wallet,
      dojo: this.dojo,
    };
  }

  // Game methods
  async startGame(difficulty: number) {
    return this.dojo.execute('game_system', 'start_game', [difficulty]);
  }

  async flipCard(gameId: number, cardIndex: number) {
    return this.dojo.execute('game_system', 'flip_card', [gameId, cardIndex]);
  }

  async getGameState(gameId: number) {
    return this.dojo.query('GameState', { game_id: gameId });
  }

  async getLeaderboard(limit: number = 10) {
    return this.dojo.query('Leaderboard', { limit });
  }

  // Storage methods
  async saveProgress(data: any) {
    return this.storage.set('game_progress', data);
  }

  async loadProgress() {
    return this.storage.get('game_progress');
  }
}
```

---

## Phase 3: Dojo Integration

### Step 3.1: Implement Dojo Client

**src/dojo/DojoClient.ts:**
```typescript
import { Account, RpcProvider } from 'starknet';
import { createClient } from '@dojoengine/torii-client';

export interface DojoConfig {
  worldAddress: string;
  rpcUrl: string;
  toriiUrl: string;
}

export class DojoClient {
  private provider: RpcProvider;
  private toriiClient: any;
  private account: Account | null = null;
  private worldAddress: string;

  constructor(config: DojoConfig) {
    this.worldAddress = config.worldAddress;
    this.provider = new RpcProvider({ nodeUrl: config.rpcUrl });
    this.toriiClient = createClient({
      rpcUrl: config.rpcUrl,
      toriiUrl: config.toriiUrl,
      worldAddress: config.worldAddress,
    });
  }

  async connect(account: Account) {
    this.account = account;
    await this.toriiClient.connect();
  }

  async execute(system: string, method: string, calldata: any[]) {
    if (!this.account) throw new Error('Account not connected');

    const tx = await this.account.execute({
      contractAddress: this.worldAddress,
      entrypoint: method,
      calldata,
    });

    await this.provider.waitForTransaction(tx.transaction_hash);
    return tx;
  }

  async query(model: string, filters: any = {}) {
    return this.toriiClient.getEntities({
      model,
      ...filters,
    });
  }

  async subscribe(model: string, callback: (data: any) => void) {
    return this.toriiClient.onEntityUpdated(model, callback);
  }
}
```

### Step 3.2: Implement Game Controller

**src/dojo/GameController.ts:**
```typescript
import { DojoClient } from './DojoClient';

export class GameController {
  constructor(private dojo: DojoClient) {}

  async startGame(difficulty: 0 | 1 | 2) {
    const tx = await this.dojo.execute('game_system', 'start_game', [difficulty]);
    
    // Parse game ID from events
    const gameId = this.parseGameIdFromEvents(tx.events);
    return gameId;
  }

  async flipCard(gameId: number, cardIndex: number) {
    return this.dojo.execute('game_system', 'flip_card', [gameId, cardIndex]);
  }

  async checkMatch(gameId: number) {
    const result = await this.dojo.execute('game_system', 'check_match', [gameId]);
    return this.parseMatchResult(result);
  }

  async abandonGame(gameId: number) {
    return this.dojo.execute('game_system', 'abandon_game', [gameId]);
  }

  async getGameState(gameId: number) {
    const entities = await this.dojo.query('GameState', {
      game_id: gameId,
    });
    return entities[0];
  }

  async subscribeToGame(gameId: number, callback: (state: any) => void) {
    return this.dojo.subscribe('GameState', (data) => {
      if (data.game_id === gameId) {
        callback(data);
      }
    });
  }

  private parseGameIdFromEvents(events: any[]): number {
    // Parse game_id from contract events
    const gameStartedEvent = events.find(e => e.keys.includes('GameStarted'));
    return parseInt(gameStartedEvent.data[0], 16);
  }

  private parseMatchResult(result: any): boolean {
    // Parse match result from transaction
    return result.events.some(e => e.keys.includes('CardsMatched'));
  }
}
```

---

## Phase 4: Account Abstraction

### Step 4.1: Implement Burner Wallet

**src/wallet/BurnerWallet.ts:**
```typescript
import { Account, ec, hash, CallData } from 'starknet';
import { TelegramStorage } from '../storage/TelegramStorage';

export class BurnerWallet {
  private storage: TelegramStorage;

  constructor() {
    this.storage = new TelegramStorage();
  }

  async getOrCreate(telegramUserId: number): Promise<Account> {
    // Try to load existing wallet
    const stored = await this.storage.get(`wallet_${telegramUserId}`);
    
    if (stored) {
      return this.loadWallet(stored);
    }

    // Create new burner wallet
    return this.createWallet(telegramUserId);
  }

  private async createWallet(telegramUserId: number): Promise<Account> {
    // Generate random private key
    const privateKey = ec.starkCurve.utils.randomPrivateKey();
    const publicKey = ec.starkCurve.getStarkKey(privateKey);

    // Deploy account contract
    const account = new Account(
      provider,
      accountAddress,
      privateKey
    );

    // Save to Telegram Cloud Storage
    await this.storage.set(`wallet_${telegramUserId}`, {
      privateKey: '0x' + Buffer.from(privateKey).toString('hex'),
      publicKey,
      address: account.address,
    });

    return account;
  }

  private loadWallet(stored: any): Account {
    return new Account(
      provider,
      stored.address,
      stored.privateKey
    );
  }
}
```

### Step 4.2: Implement Session Keys

**src/wallet/SessionKeys.ts:**
```typescript
import { Account, Call } from 'starknet';

export interface SessionPolicy {
  expiresAt: number;
  allowedMethods: string[];
  maxFee: bigint;
}

export class SessionKeyManager {
  async createSession(
    masterAccount: Account,
    policy: SessionPolicy
  ): Promise<Account> {
    // Generate session key pair
    const sessionPrivateKey = ec.starkCurve.utils.randomPrivateKey();
    const sessionPublicKey = ec.starkCurve.getStarkKey(sessionPrivateKey);

    // Register session key on-chain
    await masterAccount.execute({
      contractAddress: SESSION_REGISTRY_ADDRESS,
      entrypoint: 'register_session',
      calldata: [
        sessionPublicKey,
        policy.expiresAt,
        policy.allowedMethods.length,
        ...policy.allowedMethods,
        policy.maxFee,
      ],
    });

    // Create session account
    const sessionAccount = new Account(
      provider,
      masterAccount.address,
      sessionPrivateKey
    );

    return sessionAccount;
  }

  async executeWithSession(
    sessionAccount: Account,
    calls: Call[]
  ) {
    return sessionAccount.execute(calls);
  }

  async revokeSession(masterAccount: Account, sessionPublicKey: string) {
    return masterAccount.execute({
      contractAddress: SESSION_REGISTRY_ADDRESS,
      entrypoint: 'revoke_session',
      calldata: [sessionPublicKey],
    });
  }
}
```

---

## Phase 5: Testing & Deployment

### Step 5.1: Write Tests

**tests/integration.test.ts:**
```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { DojoTelegramSDK } from '../src';

describe('Dojo Telegram SDK Integration', () => {
  let sdk: DojoTelegramSDK;

  beforeAll(async () => {
    sdk = new DojoTelegramSDK({
      telegramBotToken: process.env.TELEGRAM_BOT_TOKEN!,
      dojoWorldAddress: process.env.WORLD_ADDRESS!,
      rpcUrl: 'http://localhost:5050',
      toriiUrl: 'http://localhost:8080',
      network: 'katana',
    });

    await sdk.initialize();
  });

  it('should authenticate with Telegram', async () => {
    const user = await sdk.auth.getUser();
    expect(user).toBeDefined();
    expect(user.id).toBeGreaterThan(0);
  });

  it('should create burner wallet', async () => {
    const wallet = await sdk.wallet.getOrCreate(12345);
    expect(wallet.address).toBeDefined();
  });

  it('should start game on-chain', async () => {
    const gameId = await sdk.startGame(0); // Easy
    expect(gameId).toBeGreaterThan(0);
  });

  it('should flip card', async () => {
    const gameId = await sdk.startGame(0);
    const tx = await sdk.flipCard(gameId, 0);
    expect(tx.transaction_hash).toBeDefined();
  });

  it('should query game state', async () => {
    const gameId = await sdk.startGame(0);
    const state = await sdk.getGameState(gameId);
    expect(state.game_id).toBe(gameId);
  });
});
```

### Step 5.2: Build SDK

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm test

# Lint
npm run lint
```

---

## Phase 6: Publishing SDK

### Step 6.1: Prepare for Publishing

**package.json:**
```json
{
  "name": "@dojoengine/telegram-sdk",
  "version": "1.0.0",
  "description": "Telegram Mini Apps SDK for Dojo games on Starknet",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "lint": "eslint src/**/*.ts",
    "prepublishOnly": "npm run build && npm test"
  },
  "keywords": [
    "dojo",
    "telegram",
    "starknet",
    "web3",
    "gaming",
    "blockchain"
  ],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "starknet": "^6.7.0",
    "@dojoengine/core": "^1.0.0-alpha.6",
    "@dojoengine/torii-client": "^1.0.0-alpha.6",
    "@telegram-apps/sdk": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^1.0.0",
    "eslint": "^8.0.0"
  }
}
```

### Step 6.2: Publish to npm

```bash
# Login to npm
npm login

# Publish
npm publish --access public
```

### Step 6.3: Documentation

Create comprehensive README with:
- Installation instructions
- Quick start guide
- API reference
- Examples
- Troubleshooting

---

## 🎯 Usage Example

```typescript
import { DojoTelegramSDK } from '@dojoengine/telegram-sdk';

// Initialize SDK
const sdk = new DojoTelegramSDK({
  telegramBotToken: 'YOUR_BOT_TOKEN',
  dojoWorldAddress: '0x...',
  rpcUrl: 'https://starknet-sepolia.public.blastapi.io',
  toriiUrl: 'https://your-torii.com',
  network: 'sepolia',
});

// Initialize (authenticates user, creates wallet, connects to Dojo)
const { user, wallet, dojo } = await sdk.initialize();

// Start a game
const gameId = await sdk.startGame(1); // Medium difficulty

// Flip a card
await sdk.flipCard(gameId, 0);

// Get game state
const state = await sdk.getGameState(gameId);

// Subscribe to updates
sdk.dojo.subscribe('GameState', (data) => {
  console.log('Game updated:', data);
});
```

---

## 📚 Next Steps

1. ✅ Implement SDK core
2. ✅ Add comprehensive tests
3. ✅ Write documentation
4. ✅ Publish to npm
5. ✅ Create example projects
6. ✅ Build community

## References

- Official Dojo Telegram integration guide (recommended authoritative reference): https://dojoengine.org/client/sdk/telegram#dojo-telegram-integration

Use the Dojo official guide above as the primary spec for Dojo-specific patterns (burner/session flows, Torii usage, and account abstraction). The SDK implementation in this plan should follow its recommendations and adapt examples where necessary.

---

**Ready to build the SDK?** Start with Phase 1! 🚀

