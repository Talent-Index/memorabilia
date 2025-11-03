# 🧪 Testing and Deployment Guide

**Feature:** Cartridge Wallet Connection & NFT Minting  
**Date:** 2025-11-02

---

## 📋 Implementation Status

### ✅ Completed

**Smart Contracts:**
- [x] Created `src/models/score_nft.cairo` - NFT model with ScoreNFT, NFTMetadata, NFTCounter
- [x] Created `src/systems/nft_system.cairo` - NFT minting system with mint_score_nft entrypoint
- [x] Created `src/tests/test_nft_system.cairo` - Comprehensive test suite (8 tests)
- [x] Updated `src/lib.cairo` - Registered new models and systems

**Frontend:**
- [x] Created `frontend/src/cartridge/config.ts` - Cartridge Controller configuration
- [x] Created `frontend/src/cartridge/CartridgeController.ts` - Wallet connection wrapper
- [x] Created `frontend/src/cartridge/nftMinter.ts` - NFT minting logic
- [x] Created `frontend/src/components/WalletButton.tsx` - Wallet connection UI
- [x] Updated `frontend/src/components/Header.tsx` - Added WalletButton
- [x] Updated `frontend/src/components/WinModal.tsx` - Added NFT minting UI
- [x] Updated `frontend/src/store/gameStore.ts` - Added wallet and NFT state
- [x] Updated `frontend/.env` - Added NFT_CONTRACT_ADDRESS
- [x] Created `frontend/.env.sepolia` - Sepolia configuration

**Documentation:**
- [x] Created `CARTRIDGE_WALLET_NFT_IMPLEMENTATION_PLAN.md` - Detailed implementation plan
- [x] Created `TESTING_AND_DEPLOYMENT_GUIDE.md` - This file

---

## 🧪 Testing Steps

### Phase 1: Smart Contract Testing

#### Step 1.1: Build Contracts

```bash
# Build the contracts
sozo build
```

**Expected Output:**
- Successful compilation
- No errors

**Troubleshooting:**
- If build fails with "could not resolve shared library path", try:
  ```bash
  scarb clean
  sozo build
  ```

#### Step 1.2: Run Tests

```bash
# Run all tests
sozo test

# Run only NFT tests
sozo test test_nft_system
```

**Expected Output:**
- All 8 NFT tests pass:
  - ✅ test_mint_nft_with_high_score
  - ✅ test_mint_nft_with_low_score (should panic)
  - ✅ test_mint_nft_with_score_9 (should panic)
  - ✅ test_mint_nft_with_score_10
  - ✅ test_mint_nft_with_zero_address (should panic)
  - ✅ test_mint_multiple_nfts
  - ✅ test_mint_nft_with_different_difficulties
  - ✅ test_get_total_minted_initially_zero

#### Step 1.3: Deploy to Katana (Local Testing)

```bash
# Terminal 1: Start Katana
katana --disable-fee

# Terminal 2: Start Torii
torii --world 0x... --rpc http://localhost:5050

# Terminal 3: Deploy contracts
sozo migrate apply

# Get the world address
sozo inspect

# Update frontend/.env with VITE_WORLD_ADDRESS
```

#### Step 1.4: Test NFT Minting on Katana

```bash
# Mint an NFT (score >= 10)
sozo execute nft_system mint_score_nft \
  --calldata 0x123,15,1234567890,1,1

# Get NFT data
sozo call nft_system get_nft --calldata 1

# Get total minted
sozo call nft_system get_total_minted
```

---

### Phase 2: Frontend Testing

#### Step 2.1: Install Dependencies

```bash
cd frontend
npm install
```

#### Step 2.2: Build Frontend

```bash
npm run build
```

**Expected Output:**
- Successful build
- No TypeScript errors
- No build warnings

#### Step 2.3: Run Frontend Locally

```bash
npm run dev
```

**Expected Output:**
- Dev server starts on http://localhost:5173
- No console errors

#### Step 2.4: Test Wallet Connection

**Manual Test Steps:**
1. Open http://localhost:5173
2. Click "Connect Wallet" button in header
3. Cartridge Controller popup should appear
4. Connect wallet
5. Wallet address should display in header (shortened format)
6. Click disconnect button (✕)
7. Wallet should disconnect

**Expected Behavior:**
- ✅ Wallet connects successfully
- ✅ Address displays correctly
- ✅ Disconnect works
- ✅ No console errors

#### Step 2.5: Test NFT Minting

**Manual Test Steps:**
1. Connect wallet
2. Start a new game (any difficulty)
3. Complete the game with score ≥ 10
4. Win modal should show "NFT Eligible!" section
5. Click "Mint NFT 🎃" button
6. Transaction should execute
7. Transaction hash should display
8. Success message should appear

**Expected Behavior:**
- ✅ NFT section only shows if score ≥ 10
- ✅ Mint button only shows if wallet connected
- ✅ Minting shows loading state
- ✅ Transaction hash displays on success
- ✅ Error message displays on failure

#### Step 2.6: Test Edge Cases

**Test Cases:**
1. **Score < 10:**
   - Complete game with score < 10
   - NFT section should NOT appear

2. **Score = 10:**
   - Complete game with score exactly 10
   - NFT section SHOULD appear

3. **No Wallet Connected:**
   - Complete game with score ≥ 10
   - NFT section shows warning: "Connect your wallet to mint NFT"
   - Mint button should NOT appear

4. **Already Minted:**
   - Mint NFT successfully
   - Mint button should disappear
   - Transaction hash should remain visible

---

### Phase 3: Integration Testing

#### Step 3.1: Test with Telegram Bot

```bash
# Start Telegram bot
cd telegram-bot
npm start
```

**Manual Test Steps:**
1. Open Telegram
2. Find @memorabilia_game_bot
3. Send `/play` command
4. Click "Play Game" button
5. Game should open in Telegram Mini App
6. Test wallet connection in Telegram
7. Test NFT minting in Telegram

**Expected Behavior:**
- ✅ Game loads in Telegram
- ✅ Wallet connection works in Telegram
- ✅ NFT minting works in Telegram
- ✅ Haptic feedback works

---

## 🚀 Deployment

### Phase 4: Deploy to Sepolia

#### Step 4.1: Prepare Sepolia Account

```bash
# Create Sepolia account (if you don't have one)
starkli account fetch <ADDRESS> --output ~/.starkli-wallets/sepolia/account.json

# Or use existing account
# Make sure you have Sepolia ETH for gas fees
```

#### Step 4.2: Update Scarb.toml

```toml
[profile.sepolia.tool.dojo]
rpc_url = "https://api.cartridge.gg/x/starknet/sepolia"
account_address = "YOUR_SEPOLIA_ADDRESS"
private_key = "YOUR_SEPOLIA_PRIVATE_KEY"
world_address = "" # Will be set after deployment
```

#### Step 4.3: Deploy Contracts to Sepolia

```bash
# Deploy to Sepolia
sozo --profile sepolia migrate apply

# Get world address
sozo --profile sepolia inspect

# Save the world address
export WORLD_ADDRESS=0x...
```

#### Step 4.4: Get NFT Contract Address

```bash
# Get NFT system contract address
sozo --profile sepolia inspect nft_system

# Save the contract address
export NFT_CONTRACT_ADDRESS=0x...
```

#### Step 4.5: Update Frontend Environment

```bash
# Update frontend/.env.sepolia
VITE_WORLD_ADDRESS=0x...  # From step 4.3
VITE_NFT_CONTRACT_ADDRESS=0x...  # From step 4.4
```

#### Step 4.6: Deploy Frontend to Vercel

```bash
cd frontend

# Build with Sepolia config
cp .env.sepolia .env
npm run build

# Deploy to Vercel
vercel --prod
```

#### Step 4.7: Update Telegram Bot

```bash
# Update telegram-bot/index.js with new Vercel URL
const GAME_URL = 'https://your-new-vercel-url.vercel.app';

# Restart bot
cd telegram-bot
npm start
```

---

## ✅ Verification Checklist

### Smart Contracts
- [ ] All tests pass (`sozo test`)
- [ ] Contracts build successfully (`sozo build`)
- [ ] Deployed to Katana (local testing)
- [ ] NFT minting works on Katana
- [ ] Deployed to Sepolia
- [ ] NFT minting works on Sepolia

### Frontend
- [ ] No TypeScript errors
- [ ] Build successful (`npm run build`)
- [ ] Wallet connection works
- [ ] Wallet disconnection works
- [ ] NFT minting works (score ≥ 10)
- [ ] NFT section hidden (score < 10)
- [ ] Error handling works
- [ ] Loading states work
- [ ] Transaction hash displays

### Integration
- [ ] Works in Telegram Mini App
- [ ] Wallet connection works in Telegram
- [ ] NFT minting works in Telegram
- [ ] Haptic feedback works
- [ ] Mobile responsive
- [ ] No console errors

### Deployment
- [ ] Contracts deployed to Sepolia
- [ ] Frontend deployed to Vercel
- [ ] Telegram bot updated
- [ ] Environment variables set
- [ ] NFT contract address configured

---

## 🐛 Troubleshooting

### Build Errors

**Error:** "could not resolve shared library path"
```bash
# Solution:
scarb clean
rm -rf target/
sozo build
```

**Error:** "no target of `cdylib` kind found"
```bash
# Solution: Update Dojo version
# In Scarb.toml:
dojo = { git = "https://github.com/dojoengine/dojo", rev = "f15def33" }
```

### Wallet Connection Errors

**Error:** "Failed to load Cartridge Controller"
```bash
# Solution: Check browser console
# Make sure unpkg CDN is accessible
# Try clearing browser cache
```

**Error:** "Wallet not connected"
```bash
# Solution: 
# 1. Click "Connect Wallet" button
# 2. Approve connection in Cartridge popup
# 3. Check that wallet address displays in header
```

### NFT Minting Errors

**Error:** "Score too low for NFT"
```bash
# Solution: Score must be ≥ 10
# Play game and achieve higher score
```

**Error:** "Invalid recipient"
```bash
# Solution: Connect wallet first
# Make sure wallet address is valid
```

**Error:** "Transaction failed"
```bash
# Solution:
# 1. Check Sepolia ETH balance
# 2. Check contract address is correct
# 3. Check RPC URL is accessible
# 4. Try again
```

---

## 📊 Test Results

### Smart Contract Tests

```bash
# Run tests
sozo test

# Expected output:
running 8 tests
test test_nft_system::tests::test_mint_nft_with_high_score ... ok
test test_nft_system::tests::test_mint_nft_with_low_score ... ok (should panic)
test test_nft_system::tests::test_mint_nft_with_score_9 ... ok (should panic)
test test_nft_system::tests::test_mint_nft_with_score_10 ... ok
test test_nft_system::tests::test_mint_nft_with_zero_address ... ok (should panic)
test test_nft_system::tests::test_mint_multiple_nfts ... ok
test test_nft_system::tests::test_mint_nft_with_different_difficulties ... ok
test test_nft_system::tests::test_get_total_minted_initially_zero ... ok

test result: ok. 8 passed; 0 failed; 0 ignored
```

---

## 🎯 Next Steps

1. **Fix Build Issues** (if any)
   - Run `sozo build`
   - Fix any compilation errors
   - Run `sozo test`

2. **Test Locally**
   - Deploy to Katana
   - Test wallet connection
   - Test NFT minting
   - Verify all functionality

3. **Deploy to Sepolia**
   - Deploy contracts
   - Update environment variables
   - Deploy frontend
   - Test on Sepolia

4. **Final Testing**
   - Test in Telegram
   - Test on mobile
   - Test all edge cases
   - Verify transaction hashes

5. **Go Live**
   - Update Telegram bot
   - Announce to users
   - Monitor for issues

---

**Status:** Implementation complete, ready for testing  
**Next Action:** Run `sozo build` and `sozo test`

