# 🔗 Blockchain Integration Plan - Memorabilia on Dojo

## Overview
This document outlines the complete plan to integrate the working Memorabilia game with Dojo blockchain on Starknet.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Phase 1: Local Development Setup](#phase-1-local-development-setup)
3. [Phase 2: Smart Contract Deployment](#phase-2-smart-contract-deployment)
4. [Phase 3: Frontend Integration](#phase-3-frontend-integration)
5. [Phase 4: Testing](#phase-4-testing)
6. [Phase 5: Testnet Deployment](#phase-5-testnet-deployment)
7. [Phase 6: Mainnet Deployment](#phase-6-mainnet-deployment)

---

## Prerequisites

### Required Tools
- [x] Node.js v18+ (already installed)
- [x] npm/yarn (already installed)
- [ ] Dojo v1.0.0-alpha.6
- [ ] Rust (for Dojo)
- [ ] Katana (local Starknet node)
- [ ] Torii (indexer)

### Installation Commands
```bash
# Install Dojo
curl -L https://install.dojoengine.org | bash
dojoup

# Verify installation
sozo --version
katana --version
torii --version
```

---

## Phase 1: Local Development Setup

### Step 1.1: Install Dojo
**Time Estimate:** 5-10 minutes

```bash
# Install Dojo toolchain
curl -L https://install.dojoengine.org | bash

# Reload shell
source ~/.bashrc  # or ~/.zshrc

# Install latest version
dojoup

# Verify
sozo --version
katana --version
torii --version
```

**Expected Output:**
```
sozo 1.0.0-alpha.6
katana 1.0.0-alpha.6
torii 1.0.0-alpha.6
```

### Step 1.2: Build Smart Contracts
**Time Estimate:** 2-3 minutes

```bash
cd /home/daniel/Documents/augment-projects/Memorabilia

# Build contracts
sozo build

# Expected output: Compilation successful
```

**Troubleshooting:**
- If build fails, check Cairo syntax in `src/` files
- Ensure Scarb.toml has correct dependencies
- Run `sozo clean` then `sozo build` again

### Step 1.3: Run Tests
**Time Estimate:** 1-2 minutes

```bash
# Run all tests
sozo test

# Run specific test
sozo test test_start_game
```

**Expected:** All tests should pass ✅

---

## Phase 2: Smart Contract Deployment

### Step 2.1: Start Katana (Local Blockchain)
**Time Estimate:** 1 minute

Open a **new terminal** and run:
```bash
cd /home/daniel/Documents/augment-projects/Memorabilia
katana --disable-fee --allowed-origins "*"
```

**Keep this terminal running!**

**Expected Output:**
```
PREFUNDED ACCOUNTS
==================
Account #0: 0x...
Private Key: 0x...

LISTENING ON: http://0.0.0.0:5050
```

### Step 2.2: Deploy Contracts to Katana
**Time Estimate:** 2-3 minutes

In your **original terminal**:
```bash
# Deploy to local Katana
sozo migrate apply

# Or use the script
./scripts/deploy.sh
```

**Expected Output:**
```
Migration successful!

World address: 0x1234567890abcdef...
```

**⚠️ IMPORTANT:** Copy the World address!

### Step 2.3: Start Torii Indexer
**Time Estimate:** 1 minute

Open **another new terminal**:
```bash
cd /home/daniel/Documents/augment-projects/Memorabilia

torii --world 0x<YOUR_WORLD_ADDRESS> \
      --rpc http://localhost:5050 \
      --allowed-origins "*"
```

**Keep this terminal running!**

**Expected Output:**
```
Torii indexer started
Listening on http://0.0.0.0:8080
```

---

## Phase 3: Frontend Integration

### Step 3.1: Configure Environment Variables
**Time Estimate:** 1 minute

```bash
cd frontend

# Edit .env file
nano .env
```

Update with your deployed addresses:
```env
# Starknet RPC URL
VITE_RPC_URL=http://localhost:5050

# Torii Indexer URL
VITE_TORII_URL=http://localhost:8080

# Dojo World Contract Address (from Step 2.2)
VITE_WORLD_ADDRESS=0x1234567890abcdef...

# Environment
VITE_ENV=development

# Network
VITE_NETWORK=katana
```

### Step 3.2: Test Blockchain Connection
**Time Estimate:** 2 minutes

```bash
# Start frontend
npm run dev
```

Open http://localhost:3000

**Check browser console:**
```
✅ Should see: "⛓️ Running in BLOCKCHAIN MODE"
✅ Should see: "✅ Blockchain initialization complete!"
```

**If you see errors:**
- Check Katana is running (terminal 1)
- Check Torii is running (terminal 2)
- Verify VITE_WORLD_ADDRESS is correct
- Check browser console for specific errors

### Step 3.3: Test Game Flow
**Time Estimate:** 5 minutes

1. **Start a game** - Select difficulty
2. **Check console** - Should see blockchain transactions
3. **Flip cards** - Each flip should create a transaction
4. **Match cards** - Should update on-chain state
5. **Win game** - Should record score on blockchain

**Expected Console Output:**
```
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

---

## Phase 4: Testing

### Step 4.1: Unit Tests
```bash
# Test smart contracts
sozo test

# All tests should pass
```

### Step 4.2: Integration Tests
Create `tests/integration.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { setupDojo } from '../src/dojo/setup';

describe('Blockchain Integration', () => {
  it('should connect to Katana', async () => {
    const dojo = await setupDojo();
    expect(dojo).toBeDefined();
  });

  it('should create burner account', async () => {
    const account = await createBurnerAccount();
    expect(account.address).toBeDefined();
  });

  it('should start game on-chain', async () => {
    const controller = createGameController(account);
    const gameId = await controller.startGame(Difficulty.Easy);
    expect(gameId).toBeGreaterThan(0);
  });
});
```

Run tests:
```bash
cd frontend
npm test
```

### Step 4.3: Manual Testing Checklist

- [ ] Start game (Easy, Medium, Hard)
- [ ] Flip cards
- [ ] Match cards
- [ ] Complete game
- [ ] Check leaderboard
- [ ] Abandon game
- [ ] Multiple games in sequence
- [ ] Check gas fees (should be 0 with session keys)

---

## Phase 5: Testnet Deployment

### Step 5.1: Deploy to Sepolia Testnet
**Time Estimate:** 10-15 minutes

```bash
# Configure Sepolia RPC
export STARKNET_RPC_URL="https://starknet-sepolia.public.blastapi.io"

# Deploy to Sepolia
sozo migrate apply --rpc-url $STARKNET_RPC_URL
```

**You'll need:**
- Sepolia testnet ETH for gas
- Starknet wallet (Argent X or Braavos)

### Step 5.2: Update Frontend for Testnet

Edit `frontend/.env`:
```env
VITE_RPC_URL=https://starknet-sepolia.public.blastapi.io
VITE_TORII_URL=https://your-torii-instance.com
VITE_WORLD_ADDRESS=0x<SEPOLIA_WORLD_ADDRESS>
VITE_ENV=staging
VITE_NETWORK=sepolia
```

### Step 5.3: Deploy Frontend

```bash
# Build for production
cd frontend
npm run build

# Deploy to Vercel/Netlify
vercel deploy
# or
netlify deploy
```

---

## Phase 6: Mainnet Deployment

### Step 6.1: Security Audit
- [ ] Smart contract audit
- [ ] Frontend security review
- [ ] Test all edge cases
- [ ] Load testing

### Step 6.2: Deploy to Mainnet

```bash
# Configure Mainnet RPC
export STARKNET_RPC_URL="https://starknet-mainnet.public.blastapi.io"

# Deploy to Mainnet
sozo migrate apply --rpc-url $STARKNET_RPC_URL
```

### Step 6.3: Production Frontend

```env
VITE_RPC_URL=https://starknet-mainnet.public.blastapi.io
VITE_TORII_URL=https://your-production-torii.com
VITE_WORLD_ADDRESS=0x<MAINNET_WORLD_ADDRESS>
VITE_ENV=production
VITE_NETWORK=mainnet
```

---

## 🎯 Quick Start Commands

### Terminal 1: Katana
```bash
katana --disable-fee --allowed-origins "*"
```

### Terminal 2: Deploy & Torii
```bash
# Deploy
sozo migrate apply

# Start Torii (replace with your World address)
torii --world 0x<WORLD_ADDRESS> --rpc http://localhost:5050
```

### Terminal 3: Frontend
```bash
cd frontend
# Update .env with World address
npm run dev
```

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   UI Layer   │  │  Game Logic  │  │   Telegram   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                  │                  │          │
│         └──────────────────┴──────────────────┘          │
│                            │                             │
│                   ┌────────▼────────┐                    │
│                   │  Dojo SDK       │                    │
│                   │  (starknet.js)  │                    │
│                   └────────┬────────┘                    │
└────────────────────────────┼─────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Torii Indexer │
                    │   (GraphQL)     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Katana / RPC   │
                    │  (Starknet Node)│
                    └────────┬────────┘
                             │
┌────────────────────────────▼─────────────────────────────┐
│                  SMART CONTRACTS (Cairo)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Game System  │  │  Leaderboard │  │   Account    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  GameState   │  │     Card     │  │ UserAccount  │  │
│  │   (Model)    │  │   (Model)    │  │   (Model)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└───────────────────────────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### Issue: "sozo: command not found"
**Solution:**
```bash
curl -L https://install.dojoengine.org | bash
source ~/.bashrc
dojoup
```

### Issue: "Katana connection failed"
**Solution:**
- Check Katana is running: `ps aux | grep katana`
- Verify port 5050 is open: `lsof -i :5050`
- Restart Katana with correct flags

### Issue: "World address not found"
**Solution:**
- Re-run deployment: `sozo migrate apply`
- Copy the World address from output
- Update `frontend/.env`

### Issue: "Transaction failed"
**Solution:**
- Check account has funds (Katana prefunds accounts)
- Verify contract is deployed
- Check transaction logs in Katana terminal

---

## 📚 Next Steps

After blockchain integration:
1. ✅ Build Telegram Mini App (see TELEGRAM_SDK_PLAN.md)
2. ✅ Add social features (friends, challenges)
3. ✅ Implement tournaments
4. ✅ Add NFT rewards
5. ✅ Deploy to mainnet

---

## 🎉 Success Criteria

You'll know blockchain integration is successful when:
- ✅ Game starts create on-chain transactions
- ✅ Card flips are recorded on blockchain
- ✅ Scores are stored permanently
- ✅ Leaderboard shows real on-chain data
- ✅ Session keys enable gasless gameplay
- ✅ Multiple players can play simultaneously

---

**Ready to start?** Run these commands:

```bash
# 1. Install Dojo
curl -L https://install.dojoengine.org | bash && dojoup

# 2. Build contracts
sozo build

# 3. Start Katana (new terminal)
katana --disable-fee

# 4. Deploy (original terminal)
sozo migrate apply

# 5. Update frontend/.env with World address

# 6. Start frontend
cd frontend && npm run dev
```

🚀 **Let's get your game on the blockchain!**

