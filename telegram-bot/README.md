# Memorabilia Telegram Bot

Telegram bot for the Memorabilia memory card game. Provides commands and Web App buttons to launch the game.

## Features

- ✅ `/start` - Welcome message with game button
- ✅ `/play` - Launch the game instantly
- ✅ `/help` - Game instructions
- ✅ `/leaderboard` - View leaderboard (opens game)
- ✅ `/about` - About the game
- ✅ Inline buttons for easy access
- ✅ Smart text responses

## Setup

### 1. Install Dependencies

```bash
cd telegram-bot
npm install
```

### 2. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your bot token:

```env
BOT_TOKEN=your_bot_token_from_botfather
WEB_APP_URL=https://memorabilia-game-6gmm06lfd-mwihotis-projects.vercel.app
```

**Get your bot token:**
1. Open Telegram and search for `@BotFather`
2. Send `/mybots`
3. Select your bot: `@memorabilia_game_bot`
4. Click "API Token"
5. Copy the token to `.env`

### 3. Run the Bot

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

You should see:
```
✅ Memorabilia bot is running!
🎮 Web App URL: https://memorabilia-game-6gmm06lfd-mwihotis-projects.vercel.app
📱 Bot is ready to receive commands
```

## Testing

### Test with Another User

1. **Search for your bot:**
   - Open Telegram
   - Search: `@memorabilia_game_bot`

2. **Test commands:**
   ```
   /start   → Welcome message with Play button
   /play    → Play Now button
   /help    → Game instructions
   ```

3. **Tap the button:**
   - Click "🎮 Play Now"
   - Game should launch in Telegram Mini App

### Expected Behavior

**When user types `/play`:**
```
🚀 Ready to test your memory?

Tap the button below to launch Memorabilia!

[🎮 Play Now]  ← This is a Web App button
```

**When user clicks the button:**
- Game opens inside Telegram
- No browser redirect
- Full Mini App experience

## Commands

| Command | Description |
|---------|-------------|
| `/start` | Welcome message with game info |
| `/play` | Launch the game |
| `/help` | How to play instructions |
| `/leaderboard` | View leaderboard (opens game) |
| `/about` | About Memorabilia |

## Deployment Options

### Option 1: Run Locally (Development)

```bash
npm run dev
```

**Pros:**
- ✅ Free
- ✅ Instant updates
- ✅ Easy debugging

**Cons:**
- ❌ Must keep terminal open
- ❌ Bot stops when computer sleeps

### Option 2: Deploy to Vercel (Recommended)

Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

Deploy:
```bash
vercel
```

**Pros:**
- ✅ Always online
- ✅ Free tier available
- ✅ Auto-scaling

### Option 3: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repo
4. Add environment variables
5. Deploy

**Pros:**
- ✅ Always online
- ✅ Free tier ($5/month credit)
- ✅ Easy setup

### Option 4: Deploy to Render

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Add environment variables
5. Deploy

**Pros:**
- ✅ Always online
- ✅ Free tier available
- ✅ Auto-deploy on push

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `BOT_TOKEN` | Telegram bot token from @BotFather | `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz` |
| `WEB_APP_URL` | Your Vercel deployment URL | `https://memorabilia-game-6gmm06lfd-mwihotis-projects.vercel.app` |

## Troubleshooting

### Bot doesn't respond

**Check:**
1. ✅ Bot is running (`npm start`)
2. ✅ `BOT_TOKEN` is correct in `.env`
3. ✅ No errors in terminal

**Fix:**
```bash
# Stop the bot (Ctrl+C)
# Restart it
npm start
```

### Web App button doesn't work

**Check:**
1. ✅ `WEB_APP_URL` is correct in `.env`
2. ✅ URL is accessible (open in browser)
3. ✅ Web App is configured in @BotFather

**Fix:**
1. Open @BotFather
2. Send `/myapps`
3. Select `memorabilia_game`
4. Verify Web App URL matches `.env`

### "This site can't be reached"

**This is normal!** The Web App only works inside Telegram.

**Test properly:**
1. Open Telegram app (not browser)
2. Search `@memorabilia_game_bot`
3. Type `/play`
4. Click the button

### Bot stops when I close terminal

**Solution:** Deploy to a hosting service (Vercel, Railway, Render)

Or use `pm2` for local persistence:
```bash
npm install -g pm2
pm2 start index.js --name memorabilia-bot
pm2 save
pm2 startup
```

## File Structure

```
telegram-bot/
├── index.js           # Main bot code
├── package.json       # Dependencies
├── .env              # Environment variables (create this)
├── .env.example      # Example environment file
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## Next Steps

1. ✅ **Test locally** - Run `npm start` and test with `/play`
2. ✅ **Test with another user** - Share bot link and verify button works
3. ✅ **Deploy to production** - Choose Vercel, Railway, or Render
4. ✅ **Set bot commands** - Configure in @BotFather for better UX

### Set Bot Commands in @BotFather

1. Open @BotFather
2. Send `/mybots`
3. Select `@memorabilia_game_bot`
4. Click "Edit Bot"
5. Click "Edit Commands"
6. Paste this:

```
start - Welcome message
play - Launch the game
help - How to play
leaderboard - View leaderboard
about - About Memorabilia
```

Now users will see these commands when they type `/` in chat!

## Support

**Issues?**
- Check the terminal for error messages
- Verify `.env` file is configured correctly
- Make sure bot token is valid
- Test Web App URL in browser first

**Need help?**
- Check Telegram Bot API docs: https://core.telegram.org/bots/api
- Telegraf documentation: https://telegraf.js.org

## License

MIT

