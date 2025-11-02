# 📱 Telegram Mini App Integration Guide

This guide explains how to integrate Memorabilia with Telegram Mini Apps for a seamless user experience.

## 🎯 Overview

The integration provides:
- **Zero-friction onboarding**: Users authenticate via Telegram
- **Gasless transactions**: Session keys enable free gameplay
- **Native experience**: Game runs inside Telegram
- **Social features**: Share scores, challenge friends

## 🏗️ Architecture

```
┌─────────────────┐
│  Telegram Bot   │
│   (Frontend)    │
└────────┬────────┘
         │
         │ WebApp API
         │
┌────────▼────────┐
│   Web Server    │
│  (Backend API)  │
└────────┬────────┘
         │
         │ Dojo SDK
         │
┌────────▼────────┐
│ Starknet/Dojo   │
│  (Smart Contracts)│
└─────────────────┘
```

## 📋 Prerequisites

1. **Telegram Bot**: Create via [@BotFather](https://t.me/botfather)
2. **Web Server**: Host the Mini App frontend
3. **Dojo Deployment**: Deployed Memorabilia contracts

**Recommended reference:** For Dojo-specific patterns (burner accounts, Torii usage, and session key workflows) follow the official Dojo Telegram integration guide: https://dojoengine.org/client/sdk/telegram#dojo-telegram-integration

## 🚀 Setup Steps

### 1. Create Telegram Bot

```bash
# Talk to @BotFather on Telegram
/newbot
# Follow prompts to create bot
# Save the bot token

# Enable Mini App
/newapp
# Select your bot
# Provide app details
```

### 2. Frontend Setup (React + Vite Example)

```bash
# Create new React app
npm create vite@latest memorabilia-app -- --template react-ts
cd memorabilia-app

# Install dependencies
npm install @telegram-apps/sdk-react
npm install @dojoengine/core @dojoengine/create-burner
npm install starknet
```

### 3. Initialize Telegram WebApp

```typescript
// src/telegram.ts
import { initData, miniApp, viewport } from '@telegram-apps/sdk-react';

export function initTelegramApp() {
  // Initialize Mini App
  miniApp.mount();
  viewport.mount();
  
  // Expand to full height
  viewport.expand();
  
  // Get user data
  const initDataParsed = initData.parse();
  const user = initDataParsed?.user;
  
  return {
    userId: user?.id,
    username: user?.username,
    firstName: user?.firstName,
    lastName: user?.lastName,
  };
}
```

### 4. Connect to Dojo

```typescript
// src/dojo/setup.ts
import { DojoProvider } from "@dojoengine/core";
import { Account, RpcProvider } from "starknet";

export interface DojoConfig {
  rpcUrl: string;
  toriiUrl: string;
  worldAddress: string;
}

export async function setupDojo(config: DojoConfig) {
  // Initialize provider
  const provider = new RpcProvider({
    nodeUrl: config.rpcUrl,
  });
  
  // Initialize Dojo provider
  const dojoProvider = new DojoProvider(
    config.worldAddress,
    provider
  );
  
  return {
    provider,
    dojoProvider,
  };
}
```

### 5. Account Abstraction Integration

```typescript
// src/dojo/account.ts
import { Account } from "starknet";
import { BurnerManager } from "@dojoengine/create-burner";

export async function createOrGetAccount(
  telegramId: number,
  dojoProvider: any
) {
  // Create burner manager for session keys
  const burnerManager = new BurnerManager({
    masterAccount: dojoProvider.masterAccount,
    accountClassHash: "0x...", // Your account class hash
    rpcProvider: dojoProvider.provider,
  });
  
  // Check if account exists on-chain
  const accountExists = await checkAccountExists(telegramId);
  
  if (!accountExists) {
    // Register new account
    const { account, sessionKey } = await registerAccount(
      telegramId,
      burnerManager
    );
    return account;
  } else {
    // Load existing account
    return await loadAccount(telegramId, burnerManager);
  }
}

async function registerAccount(
  telegramId: number,
  burnerManager: BurnerManager
) {
  // Create burner account (session key)
  const burner = await burnerManager.create();
  
  // Call account_registry.register_account
  const tx = await burner.execute({
    contractAddress: WORLD_ADDRESS,
    entrypoint: "register_account",
    calldata: [
      telegramId,
      burner.publicKey,
      burner.sessionKey,
    ],
  });
  
  await burner.waitForTransaction(tx.transaction_hash);
  
  return {
    account: burner,
    sessionKey: burner.sessionKey,
  };
}
```

### 6. Game Integration

```typescript
// src/game/GameController.ts
export class GameController {
  private account: Account;
  private worldAddress: string;
  
  constructor(account: Account, worldAddress: string) {
    this.account = account;
    this.worldAddress = worldAddress;
  }
  
  async startGame(difficulty: number): Promise<number> {
    const tx = await this.account.execute({
      contractAddress: this.worldAddress,
      entrypoint: "start_game",
      calldata: [difficulty],
    });
    
    const receipt = await this.account.waitForTransaction(
      tx.transaction_hash
    );
    
    // Extract game_id from events
    const gameId = this.extractGameId(receipt);
    return gameId;
  }
  
  async flipCard(gameId: number, cardIndex: number): Promise<void> {
    await this.account.execute({
      contractAddress: this.worldAddress,
      entrypoint: "flip_card",
      calldata: [gameId, cardIndex],
    });
  }
  
  async checkMatch(gameId: number): Promise<boolean> {
    const tx = await this.account.execute({
      contractAddress: this.worldAddress,
      entrypoint: "check_match",
      calldata: [gameId],
    });
    
    const receipt = await this.account.waitForTransaction(
      tx.transaction_hash
    );
    
    return this.extractMatchResult(receipt);
  }
  
  async getGameState(gameId: number): Promise<GameState> {
    // Query game state from Torii (indexer)
    const state = await this.queryGameState(gameId);
    return state;
  }
}
```

### 7. React Component Example

```typescript
// src/components/Game.tsx
import React, { useState, useEffect } from 'react';
import { GameController } from '../game/GameController';
import { initTelegramApp } from '../telegram';

export function Game() {
  const [gameId, setGameId] = useState<number | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [gameController, setGameController] = useState<GameController | null>(null);
  
  useEffect(() => {
    async function init() {
      // Initialize Telegram
      const telegramUser = initTelegramApp();
      
      // Setup Dojo
      const { dojoProvider } = await setupDojo({
        rpcUrl: import.meta.env.VITE_RPC_URL,
        toriiUrl: import.meta.env.VITE_TORII_URL,
        worldAddress: import.meta.env.VITE_WORLD_ADDRESS,
      });
      
      // Create or get account
      const account = await createOrGetAccount(
        telegramUser.userId,
        dojoProvider
      );
      
      // Initialize game controller
      const controller = new GameController(
        account,
        import.meta.env.VITE_WORLD_ADDRESS
      );
      setGameController(controller);
    }
    
    init();
  }, []);
  
  const handleStartGame = async (difficulty: number) => {
    if (!gameController) return;
    
    const newGameId = await gameController.startGame(difficulty);
    setGameId(newGameId);
    
    // Load game state
    const state = await gameController.getGameState(newGameId);
    setCards(state.cards);
  };
  
  const handleCardClick = async (index: number) => {
    if (!gameController || !gameId) return;
    if (flippedCards.length >= 2) return;
    
    // Flip card on-chain
    await gameController.flipCard(gameId, index);
    
    // Update local state
    setFlippedCards([...flippedCards, index]);
    
    // Check for match if 2 cards flipped
    if (flippedCards.length === 1) {
      const isMatch = await gameController.checkMatch(gameId);
      
      if (!isMatch) {
        // Reset flipped cards after delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      } else {
        setFlippedCards([]);
      }
      
      // Reload game state
      const state = await gameController.getGameState(gameId);
      setCards(state.cards);
    }
  };
  
  return (
    <div className="game">
      {!gameId ? (
        <div className="difficulty-select">
          <h2>Choose Difficulty</h2>
          <button onClick={() => handleStartGame(1)}>Easy</button>
          <button onClick={() => handleStartGame(2)}>Medium</button>
          <button onClick={() => handleStartGame(3)}>Hard</button>
        </div>
      ) : (
        <div className="game-board">
          {cards.map((card, index) => (
            <Card
              key={index}
              card={card}
              isFlipped={flippedCards.includes(index) || card.is_matched}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

## 🔐 Session Key Management

```typescript
// src/session/SessionManager.ts
export class SessionManager {
  async createSession(
    account: Account,
    worldAddress: string,
    duration: number = 86400 // 24 hours
  ) {
    // Generate session key
    const sessionKey = generateSessionKey();
    
    // Create session policy
    await account.execute({
      contractAddress: worldAddress,
      entrypoint: "create_session_policy",
      calldata: [
        account.address,
        [worldAddress], // allowed_contracts
        ["start_game", "flip_card", "check_match"], // allowed_methods
        "1000000000000000", // max_fee
        duration,
      ],
    });
    
    // Store session key securely
    await this.storeSessionKey(sessionKey);
    
    return sessionKey;
  }
  
  async executeWithSession(
    sessionKey: string,
    contractAddress: string,
    entrypoint: string,
    calldata: any[]
  ) {
    // Use session key for gasless transaction
    const sessionAccount = await this.loadSessionAccount(sessionKey);
    
    return await sessionAccount.execute({
      contractAddress,
      entrypoint,
      calldata,
    });
  }
}
```

## 📊 Real-time Updates with Torii

```typescript
// src/indexer/ToriiClient.ts
import { ToriiClient } from "@dojoengine/torii-client";

export async function subscribeToGameUpdates(
  gameId: number,
  onUpdate: (state: GameState) => void
) {
  const client = await ToriiClient.init({
    rpcUrl: TORII_URL,
    worldAddress: WORLD_ADDRESS,
  });
  
  // Subscribe to game state changes
  await client.onEntityUpdated(
    [{ model: "GameState", keys: [gameId] }],
    (entity) => {
      const gameState = parseGameState(entity);
      onUpdate(gameState);
    }
  );
}
```

## 🎨 UI/UX Best Practices

1. **Loading States**: Show spinners during transactions
2. **Error Handling**: Display user-friendly error messages
3. **Haptic Feedback**: Use Telegram's haptic API for card flips
4. **Animations**: Smooth card flip animations
5. **Responsive Design**: Works on all mobile devices

## 🚀 Deployment

```bash
# Build frontend
npm run build

# Deploy to hosting (Vercel, Netlify, etc.)
vercel deploy

# Update Telegram bot with web app URL
# Talk to @BotFather
/myapps
# Select your app
# Edit -> Web App URL
# Enter your deployed URL
```

## 📱 Testing

```bash
# Test locally with ngrok
ngrok http 5173

# Update bot with ngrok URL for testing
# Open bot in Telegram and test
```

## 🔒 Security Considerations

1. **Validate Telegram Data**: Always verify initData signature
2. **Session Key Expiry**: Implement proper expiration
3. **Rate Limiting**: Prevent abuse
4. **Secure Storage**: Never expose private keys

## 📚 Resources

- [Telegram Mini Apps Docs](https://core.telegram.org/bots/webapps)
- [Dojo SDK Documentation](https://book.dojoengine.org/)
- [Starknet.js](https://www.starknetjs.com/)

---

Ready to build! 🚀

