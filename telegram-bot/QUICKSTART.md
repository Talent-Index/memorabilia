# 🚀 Quick Start - Get Your Bot Running in 5 Minutes

## Step 1: Get Your Bot Token (2 minutes)

1. Open Telegram and search for `@BotFather`
2. Send `/mybots`
3. Select your bot: `@memorabilia_game_bot`
4. Click **"API Token"**
5. Copy the token (looks like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Step 2: Install & Configure (1 minute)

```bash
# Navigate to bot directory
cd telegram-bot

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `.env` file:**
```env
BOT_TOKEN=paste_your_token_here
WEB_APP_URL=https://memorabilia-game-6gmm06lfd-mwihotis-projects.vercel.app
```

## Step 3: Run the Bot (1 minute)

```bash
npm start
```

You should see:
```
✅ Memorabilia bot is running!
🎮 Web App URL: https://memorabilia-game-6gmm06lfd-mwihotis-projects.vercel.app
📱 Bot is ready to receive commands
```

## Step 4: Test It! (1 minute)

### Test with yourself:
1. Open Telegram
2. Search: `@memorabilia_game_bot`
3. Type: `/play`
4. Click: **"🎮 Play Now"** button
5. Game should launch! 🎉

### Test with another user:
1. Share bot link: `https://t.me/memorabilia_game_bot`
2. Ask them to type `/play`
3. They should see the button and game launches

## ✅ Success Checklist

- [ ] Bot responds to `/start`
- [ ] Bot responds to `/play`
- [ ] Button appears when typing `/play`
- [ ] Clicking button launches the game
- [ ] Game works inside Telegram
- [ ] Another user can test successfully

## 🎯 What You Should See

### When user types `/play`:

```
🚀 Ready to test your memory?

Tap the button below to launch Memorabilia!

┌─────────────────────┐
│   🎮 Play Now       │  ← This is a clickable button
└─────────────────────┘
```

### When user clicks the button:

- ✅ Game opens inside Telegram (not browser)
- ✅ Full screen Mini App experience
- ✅ All game features work
- ✅ No "This site can't be reached" error

## 🐛 Troubleshooting

### Bot doesn't respond?

**Check:**
```bash
# Is the bot running?
# You should see "✅ Memorabilia bot is running!"

# Is the token correct?
cat .env
# Should show: BOT_TOKEN=your_actual_token
```

**Fix:**
```bash
# Stop the bot (Ctrl+C)
# Check .env file has correct token
# Restart
npm start
```

### Button doesn't launch game?

**Check:**
1. Web App URL is correct in `.env`
2. Web App is configured in @BotFather:
   - Open @BotFather
   - Send `/myapps`
   - Select `memorabilia_game`
   - Verify URL matches

**Fix:**
```bash
# Update .env with correct URL
WEB_APP_URL=https://memorabilia-game-6gmm06lfd-mwihotis-projects.vercel.app

# Restart bot
npm start
```

### "This site can't be reached"?

**This is normal if you open the URL in a browser!**

The Web App only works inside Telegram.

**Test properly:**
1. ✅ Open Telegram app (not browser)
2. ✅ Search `@memorabilia_game_bot`
3. ✅ Type `/play` in chat
4. ✅ Click the button

## 🚀 Next Steps

### 1. Set Bot Commands (Optional but Recommended)

Make commands appear when users type `/`:

1. Open @BotFather
2. Send `/mybots`
3. Select `@memorabilia_game_bot`
4. Click "Edit Bot" → "Edit Commands"
5. Paste:

```
start - Welcome message
play - Launch the game
help - How to play
leaderboard - View leaderboard
about - About Memorabilia
```

### 2. Deploy to Production (Optional)

**For 24/7 availability:**

**Option A: Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

**Option B: Railway**
1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Add `BOT_TOKEN` environment variable
4. Deploy

**Option C: Render**
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Add environment variables
5. Deploy

### 3. Share with Users

**Direct link:**
```
https://t.me/memorabilia_game_bot
```

**Share message:**
```
🎮 Play Memorabilia - Memory Card Game!

Test your memory with our on-chain game built on Starknet.

👉 https://t.me/memorabilia_game_bot

Type /play to start! 🚀
```

## 📝 Available Commands

| Command | What it does |
|---------|--------------|
| `/start` | Welcome message with game info |
| `/play` | **Launch the game** ⭐ |
| `/help` | How to play instructions |
| `/leaderboard` | View leaderboard |
| `/about` | About Memorabilia |

## 💡 Tips

1. **Keep terminal open** - Bot stops when you close terminal (unless deployed)
2. **Test with another user** - Best way to verify everything works
3. **Check logs** - Terminal shows all bot activity
4. **Deploy for 24/7** - Use Vercel, Railway, or Render for always-on bot

## 🎉 You're Done!

Your bot is now running and users can play the game by typing `/play`!

**Test it now:**
1. Open Telegram
2. Search: `@memorabilia_game_bot`
3. Type: `/play`
4. Click: "🎮 Play Now"
5. Enjoy! 🎮✨

---

**Need help?** Check the full README.md for detailed documentation.

