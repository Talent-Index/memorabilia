# 🚀 Deploy Memorabilia to Vercel

## Why Vercel > ngrok for Telegram Mini Apps

✅ **Permanent URL** - Never changes  
✅ **Always online** - No need to keep terminal running  
✅ **Fast CDN** - Global edge network  
✅ **Free tier** - Generous limits  
✅ **Custom domain** - Professional URLs  
✅ **Auto-deploy** - Push to deploy  

---

## 🎯 Quick Deploy (5 minutes)

### Step 1: Install Vercel CLI

```bash
cd /home/daniel/Documents/augment-projects/Memorabilia/frontend

# Install Vercel CLI globally
npm install -g vercel

# Or use npx (no installation needed)
npx vercel
```

### Step 2: Deploy

```bash
# Login to Vercel (first time only)
vercel login

# Deploy the frontend
vercel

# Follow the prompts:
# ? Set up and deploy "~/Documents/augment-projects/Memorabilia/frontend"? [Y/n] y
# ? Which scope do you want to deploy to? Your Account
# ? Link to existing project? [y/N] n
# ? What's your project's name? memorabilia-game
# ? In which directory is your code located? ./
# ? Want to override the settings? [y/N] n
```

**You'll get a URL like:**
```
https://memorabilia-game.vercel.app
```

### Step 3: Deploy to Production

```bash
# Deploy to production (stable URL)
vercel --prod
```

**Production URL:**
```
https://memorabilia-game.vercel.app
```

---

## 🔧 Configure Vercel for Vite

### Create `vercel.json` in frontend directory:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📝 Update BotFather with Vercel URL

### Option 1: Update Existing App

```
/myapps
```
→ Select "memorabilia_game"  
→ Edit Web App URL  
→ Paste Vercel URL: `https://memorabilia-game.vercel.app`  
→ Save

### Option 2: Create New App (if needed)

```
/newapp
```
- Select bot: `memorabilia_game_bot`
- Title: `Memorabilia`
- Description: `On-chain memory card matching game`
- **Web App URL:** `https://memorabilia-game.vercel.app`
- Short name: `memorabilia_game`

---

## 🎯 Environment Variables on Vercel

### Add via Vercel Dashboard:

1. Go to https://vercel.com/dashboard
2. Select your project: `memorabilia-game`
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
VITE_WORLD_ADDRESS=0x
VITE_RPC_URL=http://localhost:5050
VITE_TORII_URL=http://localhost:8080
VITE_TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN
VITE_ENV=production
VITE_NETWORK=mainnet
```

### Or add via CLI:

```bash
# Add environment variable
vercel env add VITE_WORLD_ADDRESS

# When prompted, enter: 0x
# Select: Production, Preview, Development
```

---

## 🔄 Auto-Deploy from Git

### Connect to GitHub:

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "feat: add Vercel configuration"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure project:
     - **Framework Preset:** Vite
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
   - Click **Deploy**

3. **Auto-deploy on push:**
   - Every push to `main` → auto-deploys to production
   - Every PR → gets preview URL
   - No manual deployment needed!

---

## 📊 Comparison: ngrok vs Vercel

### Use ngrok when:
- ✅ Quick local testing
- ✅ Testing blockchain integration (Katana running locally)
- ✅ Debugging with local backend
- ✅ Development iteration

### Use Vercel when:
- ✅ Sharing with team
- ✅ Telegram Mini App production
- ✅ Public testing
- ✅ Stable URL needed
- ✅ Always-available app

---

## 🎯 Recommended Setup

### Development:
```bash
# Terminal 1: Frontend dev server
npm run dev
# → http://localhost:3000

# Terminal 2: ngrok (for local testing with Telegram)
ngrok http 3000
# → https://xyz.ngrok-free.app
```

### Production/Testing:
```bash
# Deploy to Vercel
vercel --prod
# → https://memorabilia-game.vercel.app

# Update BotFather with Vercel URL
# → Permanent, always available
```

---

## ✅ Benefits of Vercel for Your Use Case

### 1. **Permanent URL**
- ngrok: `https://d3a2e57728bf.ngrok-free.app` (changes on restart)
- Vercel: `https://memorabilia-game.vercel.app` (permanent)

### 2. **No Terminal Required**
- ngrok: Must keep terminal running
- Vercel: Always online, no maintenance

### 3. **Team Sharing**
- ngrok: Only works when your computer is on
- Vercel: Anyone can access anytime

### 4. **Telegram Integration**
- ngrok: Must update BotFather when URL changes
- Vercel: Set once, never change

### 5. **Performance**
- ngrok: Tunneling adds latency
- Vercel: Edge CDN, super fast

---

## 🚀 Quick Start Commands

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
cd /home/daniel/Documents/augment-projects/Memorabilia/frontend
vercel --prod

# 4. Copy the URL
# Example: https://memorabilia-game.vercel.app

# 5. Update BotFather
# /myapps → Edit Web App URL → Paste Vercel URL
```

---

## 📱 Your Current Setup

### What you have now:
- ✅ Bot created: `@memorabilia_game_bot`
- ✅ Web App created: `memorabilia_game`
- ✅ ngrok URL: `https://d3a2e57728bf.ngrok-free.app`
- ✅ Web App link: `https://t.me/memorabilia_game_bot/memorabilia_game`

### What to do:
1. **Deploy to Vercel** (5 minutes)
2. **Update BotFather** with Vercel URL (1 minute)
3. **Test** in Telegram (2 minutes)
4. **Keep ngrok** for local development

---

## 🎯 Recommended Workflow

### For Development:
```bash
# Use ngrok for local testing
npm run dev
ngrok http 3000
# Test with: https://xyz.ngrok-free.app
```

### For Team/Production:
```bash
# Deploy to Vercel
vercel --prod
# Share: https://memorabilia-game.vercel.app
# Update BotFather once
```

---

## 📝 Next Steps

1. **Deploy to Vercel now:**
   ```bash
   cd /home/daniel/Documents/augment-projects/Memorabilia/frontend
   npx vercel --prod
   ```

2. **Get your Vercel URL**

3. **Update BotFather:**
   ```
   /myapps
   → memorabilia_game
   → Edit Web App URL
   → Paste Vercel URL
   ```

4. **Test in Telegram**

5. **You can stop ngrok** (or keep it for local dev)

---

## 💡 Pro Tip

**Use both!**
- **Vercel:** For stable, production-ready URL
- **ngrok:** For local development and testing

This gives you the best of both worlds! 🚀

---

**Ready to deploy? Run this now:**

```bash
cd /home/daniel/Documents/augment-projects/Memorabilia/frontend
npx vercel --prod
```

Then update BotFather with your new permanent Vercel URL! ✨

