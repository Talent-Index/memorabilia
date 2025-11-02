# 🚀 Complete Deployment Guide

Step-by-step guide to deploy Memorabilia from local development to production.

## Overview

```
Local Development → Testnet → Production
     ↓                ↓           ↓
   Katana         Sepolia      Mainnet
```

## Phase 1: Local Development ✅

### 1.1 Install Dojo

```bash
curl -L https://install.dojoengine.org | bash
dojoup
```

### 1.2 Build Contracts

```bash
cd /path/to/Memorabilia
sozo build
```

### 1.3 Run Tests

```bash
sozo test
```

### 1.4 Start Katana

```bash
# Terminal 1
katana --disable-fee
```

### 1.5 Deploy to Katana

```bash
# Terminal 2
sozo migrate apply
```

Save the World address printed!

### 1.6 Start Torii (Optional)

```bash
# Terminal 3
torii --world 0xYOUR_WORLD_ADDRESS
```

### 1.7 Test Contracts

```bash
# Register account
sozo execute account_registry register_account \
  --calldata 123456789,0x1234,0x5678

# Start game
sozo execute game_system start_game --calldata 1

# Flip cards
sozo execute game_system flip_card --calldata 1,0
sozo execute game_system flip_card --calldata 1,1

# Check match
sozo execute game_system check_match --calldata 1
```

## Phase 2: Frontend Development

### 2.1 Setup Frontend

```bash
cd frontend
npm install
```

### 2.2 Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_RPC_URL=http://localhost:5050
VITE_TORII_URL=http://localhost:8080
VITE_WORLD_ADDRESS=0xYOUR_WORLD_ADDRESS_FROM_KATANA
VITE_NETWORK=katana
```

### 2.3 Run Frontend

```bash
npm run dev
```

Open http://localhost:3000

### 2.4 Test Locally

- Choose difficulty
- Play a game
- Check console for errors
- Verify blockchain interactions

## Phase 3: Testnet Deployment

### 3.1 Get Testnet Account

Create a Starknet account:
- Use Argent X or Braavos wallet
- Switch to Sepolia testnet
- Get testnet ETH from [faucet](https://faucet.goerli.starknet.io/)

### 3.2 Configure for Testnet

Create `dojo_sepolia.toml`:

```toml
[world]
name = "Memorabilia"
description = "On-chain memory game"

[env]
rpc_url = "https://starknet-sepolia.public.blastapi.io"
account_address = "YOUR_ACCOUNT_ADDRESS"
private_key = "YOUR_PRIVATE_KEY"
world_address = ""

[profile.sepolia]
rpc_url = "https://starknet-sepolia.public.blastapi.io"
```

⚠️ **Never commit private keys!**

### 3.3 Deploy to Sepolia

```bash
sozo --profile sepolia migrate apply
```

This will:
1. Compile contracts
2. Declare contracts
3. Deploy world
4. Register systems
5. Initialize models

Save the World address!

### 3.4 Verify Deployment

```bash
# Check world
sozo --profile sepolia model get GameState 1

# Test transaction
sozo --profile sepolia execute game_system start_game --calldata 1
```

### 3.5 Start Torii for Testnet

```bash
torii --world 0xYOUR_SEPOLIA_WORLD_ADDRESS \
      --rpc https://starknet-sepolia.public.blastapi.io

## Cartridge Controller (optional but recommended)

If your Game Jam or Dojo pattern requires using a Cartridge Controller (a system that manages cartridges or modules registered to the world), follow these steps.

1. Add a Cartridge Controller system to `src/systems/` (a stub `cartridge_controller.cairo` is included in this repo).
2. Export/register the system in your world initializer so it's included when running `sozo migrate apply`.
3. Implement entrypoints such as `register_cartridge`, `remove_cartridge`, and `list_cartridges` inside `src/systems/cartridge_controller.cairo`.
4. Redeploy using the same migration flow.

Example (high level):

```bash
# After implementing the controller and adding it to your initializer
sozo build
sozo test
sozo --profile sepolia migrate apply
```

Note: exact APIs for cartridge management depend on your design. The stub in `src/systems/cartridge_controller.cairo` documents expected entrypoints and is a starting point.

## Deploying to Dojo Slot (example)

If you need to deploy to a Dojo-managed Slot environment rather than Sepolia, obtain the Slot RPC URL and credentials from Dojo first. A sample profile file `dojo_slot_example.toml` is included; copy it to `dojo_slot.toml` and replace the placeholders.

Then run:

```bash
# Use the named profile to migrate to Slot
sozo --profile slot migrate apply
```

Or, if the Slot provider requires a direct RPC URL, you can run:

```bash
export STARKNET_RPC_URL="https://<DOJO_SLOT_RPC_URL>"
sozo migrate apply --rpc-url $STARKNET_RPC_URL
```

If the Slot environment requires additional authentication or a different `sozo` configuration, follow the provider instructions and add the required profile to your Scarb/dojo configs.

```

## Phase 4: Frontend Deployment

### 4.1 Build Frontend

```bash
cd frontend
npm run build
```

### 4.2 Deploy to Vercel

#### Option A: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

#### Option B: GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Configure build:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `frontend`

### 4.3 Set Environment Variables

In Vercel dashboard:

```
VITE_RPC_URL=https://starknet-sepolia.public.blastapi.io
VITE_TORII_URL=https://your-torii-server.com
VITE_WORLD_ADDRESS=0xYOUR_SEPOLIA_WORLD_ADDRESS
VITE_NETWORK=sepolia
```

### 4.4 Deploy

Vercel will auto-deploy on push to main branch.

### 4.5 Alternative: Netlify

```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod
```

Set environment variables in Netlify dashboard.

## Phase 5: Telegram Bot Setup

### 5.1 Create Bot

See [TELEGRAM_BOT_SETUP.md](./TELEGRAM_BOT_SETUP.md) for detailed instructions.

Quick steps:
1. Talk to [@BotFather](https://t.me/botfather)
2. `/newbot` - Create bot
3. `/newapp` - Create Mini App
4. Set Web App URL to your Vercel URL

### 5.2 Test in Telegram

1. Find your bot
2. Click Start
3. Open Mini App
4. Play a game
5. Verify blockchain interactions

## Phase 6: Production (Mainnet)

### 6.1 Prepare for Mainnet

⚠️ **Important Checks:**
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Testnet thoroughly tested
- [ ] Gas costs optimized
- [ ] Frontend tested in Telegram
- [ ] Backup plan ready

### 6.2 Get Mainnet ETH

You'll need ETH for:
- Contract deployment (~0.1 ETH)
- Initial transactions
- Buffer for users

### 6.3 Configure for Mainnet

Create `dojo_mainnet.toml`:

```toml
[env]
rpc_url = "https://starknet-mainnet.public.blastapi.io"
account_address = "YOUR_MAINNET_ACCOUNT"
private_key = "YOUR_MAINNET_PRIVATE_KEY"
```

### 6.4 Deploy to Mainnet

```bash
sozo --profile mainnet migrate apply
```

### 6.5 Update Frontend

Update environment variables:

```env
VITE_RPC_URL=https://starknet-mainnet.public.blastapi.io
VITE_TORII_URL=https://your-production-torii.com
VITE_WORLD_ADDRESS=0xYOUR_MAINNET_WORLD_ADDRESS
VITE_NETWORK=mainnet
```

Redeploy frontend.

### 6.6 Update Telegram Bot

Update Web App URL to production frontend.

## Phase 7: Monitoring & Maintenance

### 7.1 Setup Monitoring

#### Error Tracking

```bash
# Install Sentry
npm install @sentry/react @sentry/vite-plugin
```

Configure in `frontend/src/main.tsx`:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.VITE_ENV,
});
```

#### Analytics

```bash
npm install @vercel/analytics
```

Add to `App.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### 7.2 Monitor Blockchain

- Watch contract events
- Track gas usage
- Monitor transaction success rate
- Check for errors

### 7.3 Setup Alerts

Create alerts for:
- High error rate
- Failed transactions
- Low balance
- Unusual activity

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Code reviewed
- [ ] Security audit (for mainnet)
- [ ] Gas costs acceptable
- [ ] Frontend tested
- [ ] Telegram integration tested
- [ ] Documentation updated
- [ ] Backup plan ready

### Deployment

- [ ] Contracts deployed
- [ ] World address saved
- [ ] Systems registered
- [ ] Models initialized
- [ ] Frontend deployed
- [ ] Environment variables set
- [ ] Telegram bot configured
- [ ] DNS configured (if custom domain)

### Post-Deployment

- [ ] Smoke tests passed
- [ ] Monitoring active
- [ ] Alerts configured
- [ ] Team notified
- [ ] Users notified
- [ ] Documentation published
- [ ] Support channels ready

## Rollback Plan

If something goes wrong:

### 1. Frontend Rollback

```bash
# Vercel
vercel rollback

# Netlify
netlify rollback
```

### 2. Contract Issues

- Deploy fixed version
- Migrate data if needed
- Update frontend to new address

### 3. Communication

- Notify users immediately
- Post status updates
- Provide ETA for fix

## Cost Estimates

### Testnet (Free)
- Deployment: Free (testnet ETH)
- Transactions: Free
- Hosting: Free (Vercel/Netlify free tier)

### Mainnet
- Contract Deployment: ~0.05-0.1 ETH
- Torii Server: $20-50/month
- Frontend Hosting: Free-$20/month
- Domain: $10-15/year
- Monitoring: Free-$30/month

**Total Initial**: ~$100-200
**Monthly**: ~$20-100

## Performance Optimization

### Frontend

```bash
# Analyze bundle
npm run build
npx vite-bundle-visualizer
```

Optimize:
- Code splitting
- Lazy loading
- Image optimization
- Caching

### Contracts

- Minimize storage
- Batch operations
- Optimize loops
- Use efficient data structures

### Torii

- Index only needed events
- Use database indexes
- Cache frequent queries
- Implement pagination

## Security Best Practices

1. **Never commit secrets**
   - Use `.env` files
   - Add to `.gitignore`
   - Use environment variables

2. **Validate all inputs**
   - Frontend validation
   - Contract validation
   - Backend validation

3. **Rate limiting**
   - Prevent spam
   - Protect against DoS
   - Limit API calls

4. **Monitor for attacks**
   - Unusual patterns
   - High gas usage
   - Failed transactions

## Support & Resources

- **Dojo Docs**: https://book.dojoengine.org/
- **Starknet Docs**: https://docs.starknet.io/
- **Discord**: https://discord.gg/dojoengine
- **GitHub**: https://github.com/dojoengine/dojo

## Next Steps

After deployment:

1. 🎉 Celebrate launch!
2. 📊 Monitor metrics
3. 🐛 Fix bugs quickly
4. 💬 Gather feedback
5. 🚀 Plan next features
6. 📈 Grow user base

---

Good luck with your deployment! 🚀

