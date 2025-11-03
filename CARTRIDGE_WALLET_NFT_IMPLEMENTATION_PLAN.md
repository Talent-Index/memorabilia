# 🎮 Cartridge Wallet & NFT Minting Implementation Plan

**Date:** 2025-11-02  
**Feature:** Cartridge Controller Wallet Connection + NFT Minting for High Scores

---

## 📋 Executive Summary

Implement Cartridge Controller wallet connection and NFT minting functionality for players who achieve a score of 10 or higher.

**Key Features:**
1. ✅ Wallet connection via Cartridge Controller
2. ✅ NFT minting for scores ≥ 10
3. ✅ Session policies for gasless transactions
4. ✅ Transaction confirmation with hash display

---

## 🎯 Requirements

### Functional Requirements

**Wallet Connection:**
- [ ] "Connect Wallet" button in HUD/Header
- [ ] Support Starknet Sepolia testnet
- [ ] Display wallet address (shortened format: 0x1234...5678)
- [ ] Connection persists during game session
- [ ] Lazy-load Cartridge Controller from unpkg CDN

**NFT Minting:**
- [ ] Eligibility: Score ≥ 10
- [ ] "Mint NFT 🎃" button on game over screen
- [ ] Auto-execute transaction with session policies
- [ ] Display transaction hash on success
- [ ] NFT data: recipient address, score (u256), timestamp (u64)

**Configuration:**
- [ ] Network: Starknet Sepolia
- [ ] RPC: https://api.cartridge.gg/x/starknet/sepolia
- [ ] Chain ID: SN_SEPOLIA
- [ ] Session policies for `mint_score_nft` entrypoint

---

## 🏗️ Architecture

### Frontend Components

```
frontend/src/
├── components/
│   ├── Header.tsx                    # Add "Connect Wallet" button
│   ├── WinModal.tsx                  # Add "Mint NFT" button
│   └── WalletButton.tsx              # NEW: Wallet connection UI
│
├── cartridge/
│   ├── CartridgeController.ts        # NEW: Cartridge Controller wrapper
│   ├── config.ts                     # NEW: Cartridge configuration
│   └── nftMinter.ts                  # NEW: NFT minting logic
│
├── store/
│   └── gameStore.ts                  # Add wallet state
│
└── types/
    └── index.ts                      # Add Cartridge types
```

### Smart Contracts

```
src/
├── models/
│   └── score_nft.cairo               # NEW: NFT model
│
├── systems/
│   └── nft_system.cairo              # NEW: NFT minting system
│
└── lib.cairo                         # Register new modules
```

---

## 📝 Implementation Steps

### Phase 1: Smart Contract (NFT System)

**Step 1.1: Create NFT Model**
- File: `src/models/score_nft.cairo`
- Fields: `token_id`, `recipient`, `score`, `timestamp`, `game_id`

**Step 1.2: Create NFT System**
- File: `src/systems/nft_system.cairo`
- Entrypoint: `mint_score_nft(recipient: ContractAddress, score: u256, timestamp: u64)`
- Validation: Score ≥ 10
- Emit event: `NFTMinted`

**Step 1.3: Update lib.cairo**
- Register `score_nft` model
- Register `nft_system` system

**Step 1.4: Write Tests**
- File: `src/tests/test_nft_system.cairo`
- Test minting with score ≥ 10
- Test rejection with score < 10
- Test NFT data integrity

---

### Phase 2: Cartridge Controller Integration

**Step 2.1: Create Cartridge Configuration**
- File: `frontend/src/cartridge/config.ts`
- Network: Sepolia
- RPC URL: https://api.cartridge.gg/x/starknet/sepolia
- Chain ID: SN_SEPOLIA
- Session policies

**Step 2.2: Create Cartridge Controller Wrapper**
- File: `frontend/src/cartridge/CartridgeController.ts`
- Lazy-load from unpkg
- Connect wallet method
- Disconnect wallet method
- Get account method
- Session management

**Step 2.3: Create NFT Minter**
- File: `frontend/src/cartridge/nftMinter.ts`
- Mint NFT function
- Transaction status tracking
- Error handling

---

### Phase 3: Frontend UI Components

**Step 3.1: Create Wallet Button Component**
- File: `frontend/src/components/WalletButton.tsx`
- Connect/Disconnect button
- Display wallet address (shortened)
- Loading states
- Error states

**Step 3.2: Update Header Component**
- Add WalletButton to header
- Position: Top right
- Responsive design

**Step 3.3: Update WinModal Component**
- Add "Mint NFT 🎃" button
- Show only if score ≥ 10
- Show only if wallet connected
- Display transaction hash on success
- Loading state during minting

---

### Phase 4: State Management

**Step 4.1: Update Game Store**
- Add wallet state: `walletAddress`, `isWalletConnected`, `cartridgeController`
- Add NFT state: `isMinting`, `mintTxHash`, `mintError`
- Add actions: `connectWallet`, `disconnectWallet`, `mintNFT`

**Step 4.2: Update Types**
- Add Cartridge Controller types
- Add NFT minting types
- Add session policy types

---

### Phase 5: Testing & Deployment

**Step 5.1: Smart Contract Tests**
- Run: `sozo test`
- Verify all NFT tests pass

**Step 5.2: Local Testing**
- Deploy contracts to Katana
- Test wallet connection
- Test NFT minting
- Test session policies

**Step 5.3: Sepolia Deployment**
- Deploy contracts to Sepolia
- Update NFT_CONTRACT_ADDRESS
- Test on Sepolia testnet

**Step 5.4: Frontend Testing**
- Test wallet connection flow
- Test NFT minting flow
- Test error handling
- Test UI responsiveness

---

## 📦 Dependencies

### Smart Contract Dependencies
```toml
# Scarb.toml
[dependencies]
dojo = { git = "https://github.com/dojoengine/dojo", tag = "v1.0.0-alpha.6" }
```

### Frontend Dependencies
```json
{
  "@cartridge/controller": "latest",
  "starknet": "^5.14.1"
}
```

**Note:** Cartridge Controller will be lazy-loaded from unpkg CDN, so no npm install needed.

---

## 🔧 Configuration Files

### 1. Cartridge Configuration

**File:** `frontend/src/cartridge/config.ts`

```typescript
export const CARTRIDGE_CONFIG = {
  network: 'sepolia' as const,
  rpcUrl: 'https://api.cartridge.gg/x/starknet/sepolia',
  chainId: 'SN_SEPOLIA',
  policies: [
    {
      target: NFT_CONTRACT_ADDRESS,
      method: 'mint_score_nft',
      description: 'Mint NFT for high scores',
    },
  ],
};

export const NFT_CONTRACT_ADDRESS = '0x...'; // Update after deployment
```

### 2. Environment Variables

**File:** `frontend/.env`

```env
# Existing
VITE_RPC_URL=https://api.cartridge.gg/x/starknet/sepolia
VITE_TORII_URL=https://api.cartridge.gg/x/torii/sepolia
VITE_WORLD_ADDRESS=0x...
VITE_NETWORK=sepolia

# New
VITE_NFT_CONTRACT_ADDRESS=0x...
VITE_CARTRIDGE_APP_ID=memorabilia
```

---

## 📊 Data Flow

### Wallet Connection Flow

```
User clicks "Connect Wallet"
  ↓
Load Cartridge Controller from unpkg
  ↓
Initialize controller with config
  ↓
Request wallet connection
  ↓
User approves in Cartridge popup
  ↓
Store wallet address in state
  ↓
Display shortened address in UI
```

### NFT Minting Flow

```
Game ends with score ≥ 10
  ↓
Show "Mint NFT 🎃" button
  ↓
User clicks button
  ↓
Check wallet connected
  ↓
Prepare transaction data:
  - recipient: wallet address
  - score: final score (u256)
  - timestamp: current time (u64)
  ↓
Execute transaction with session policy
  ↓
Wait for transaction confirmation
  ↓
Display transaction hash
  ↓
Show success message
```

---

## 🧪 Testing Strategy

### Unit Tests

**Smart Contract Tests:**
- ✅ Test NFT minting with valid score
- ✅ Test NFT minting rejection with low score
- ✅ Test NFT data integrity
- ✅ Test event emission
- ✅ Test access control

**Frontend Tests:**
- ✅ Test wallet connection
- ✅ Test wallet disconnection
- ✅ Test NFT minting eligibility
- ✅ Test transaction error handling

### Integration Tests

- ✅ End-to-end wallet connection
- ✅ End-to-end NFT minting
- ✅ Session policy validation
- ✅ Transaction confirmation

### Manual Tests

- ✅ Test on Sepolia testnet
- ✅ Test in Telegram Mini App
- ✅ Test on mobile devices
- ✅ Test error scenarios

---

## 🚀 Deployment Checklist

### Smart Contracts

- [ ] Write NFT model
- [ ] Write NFT system
- [ ] Write tests
- [ ] Run tests locally
- [ ] Deploy to Katana (local testing)
- [ ] Deploy to Sepolia
- [ ] Verify contract on Voyager
- [ ] Update NFT_CONTRACT_ADDRESS in frontend

### Frontend

- [ ] Implement Cartridge Controller wrapper
- [ ] Implement NFT minter
- [ ] Create WalletButton component
- [ ] Update Header component
- [ ] Update WinModal component
- [ ] Update game store
- [ ] Test locally
- [ ] Test on Sepolia
- [ ] Deploy to Vercel
- [ ] Test in production

---

## 📈 Success Metrics

- ✅ Wallet connection success rate > 95%
- ✅ NFT minting success rate > 90%
- ✅ Transaction confirmation time < 30 seconds
- ✅ Zero wallet connection errors
- ✅ UI responsive on all devices

---

## 🔒 Security Considerations

1. **Session Policies:**
   - Limit to `mint_score_nft` entrypoint only
   - No unlimited approvals
   - Session expires after game

2. **Score Validation:**
   - Validate score ≥ 10 on-chain
   - Prevent score manipulation
   - Verify game completion

3. **Access Control:**
   - Only game contract can mint NFTs
   - Prevent unauthorized minting
   - Rate limiting

---

## 📚 Resources

- [Cartridge Controller Docs](https://docs.cartridge.gg/)
- [Starknet Sepolia Testnet](https://sepolia.voyager.online/)
- [Dojo Documentation](https://book.dojoengine.org/)
- [Session Keys Guide](https://book.dojoengine.org/framework/session-keys.html)

---

## 🎯 Next Steps

1. **Review this plan** ✅
2. **Implement smart contracts** (Phase 1)
3. **Implement Cartridge integration** (Phase 2)
4. **Implement UI components** (Phase 3)
5. **Update state management** (Phase 4)
6. **Test and deploy** (Phase 5)

---

**Estimated Time:** 6-8 hours  
**Complexity:** Medium  
**Priority:** High


