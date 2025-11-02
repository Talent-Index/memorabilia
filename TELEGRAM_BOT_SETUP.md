# 🤖 Telegram Bot Setup Guide

Complete guide to setting up your Memorabilia Telegram Mini App.

## Prerequisites

- ✅ Telegram account
- ✅ Frontend deployed (Vercel/Netlify)
- ✅ Smart contracts deployed to testnet/mainnet

## Step 1: Create Telegram Bot

### 1.1 Talk to BotFather

Open Telegram and search for [@BotFather](https://t.me/botfather)

### 1.2 Create New Bot

```
/newbot
```

BotFather will ask:
1. **Bot name**: `Memorabilia Game` (or your choice)
2. **Bot username**: `memorabilia_game_bot` (must end with `_bot`)

### 1.3 Save Bot Token

BotFather will give you a token like:
```
123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

⚠️ **Keep this secret!** Don't commit to Git.

## Step 2: Create Mini App

### 2.1 Create App

```
/newapp
```

BotFather will ask:
1. **Select bot**: Choose your bot from the list
2. **App title**: `Memorabilia`
3. **App description**: `On-chain memory card game on Starknet`
4. **Photo**: Upload a 640x360 image (optional)
5. **Demo GIF**: Upload a demo (optional)
6. **Web App URL**: Your deployed frontend URL
   - Example: `https://memorabilia.vercel.app`

### 2.2 Configure App

After creation, you can edit:

```
/myapps
# Select your app
```

Options:
- **Edit**: Change title, description, photo
- **Web App URL**: Update URL
- **Direct Link**: Get shareable link

## Step 3: Configure Bot Commands

### 3.1 Set Commands

```
/setcommands
```

Select your bot, then paste:

```
start - Start the game
play - Play Memorabilia
leaderboard - View top scores
stats - View your statistics
help - Get help
```

### 3.2 Set Description

```
/setdescription
```

Paste:
```
🎮 Memorabilia - On-chain Memory Card Game

Test your memory and compete on the blockchain! Match pairs of cards, earn points, and climb the leaderboard.

Powered by Starknet & Dojo
```

### 3.3 Set About Text

```
/setabouttext
```

Paste:
```
On-chain memory card game built with Dojo on Starknet. All game state is stored on the blockchain!
```

### 3.4 Set Bot Picture

```
/setuserpic
```

Upload a 512x512 image for your bot's profile picture.

## Step 4: Test Your Bot

### 4.1 Find Your Bot

Search for your bot username in Telegram: `@memorabilia_game_bot`

### 4.2 Start Bot

Click **Start** or send `/start`

### 4.3 Open Mini App

You should see a button to open the game. Click it!

### 4.4 Test Gameplay

- Choose difficulty
- Play a game
- Check if blockchain interactions work
- Test leaderboard

## Step 5: Advanced Configuration

### 5.1 Inline Mode (Optional)

Allow users to share the game in chats:

```
/setinline
```

Enable inline mode and set placeholder text:
```
Search for game...
```

### 5.2 Menu Button

Set the menu button to open your app:

```
/setmenubutton
```

Select your bot and configure:
- **Text**: `Play Game 🎮`
- **URL**: Your web app URL

### 5.3 Domain

Link your custom domain:

```
/setdomain
```

## Step 6: Bot Backend (Optional)

For advanced features, create a bot backend.

### 6.1 Create Node.js Server

```bash
mkdir telegram-bot
cd telegram-bot
npm init -y
npm install node-telegram-bot-api express dotenv
```

### 6.2 Create Bot Script

Create `bot.js`:

```javascript
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
const webAppUrl = process.env.WEB_APP_URL;

const bot = new TelegramBot(token, { polling: true });

// Start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, '🎮 Welcome to Memorabilia!', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Play Game 🎮',
          web_app: { url: webAppUrl }
        }
      ]]
    }
  });
});

// Play command
bot.onText(/\/play/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 'Ready to play?', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Start Game 🚀',
          web_app: { url: webAppUrl }
        }
      ]]
    }
  });
});

// Leaderboard command
bot.onText(/\/leaderboard/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, '🏆 Top Players:\n\n1. Alice - 12,500\n2. Bob - 12,200\n3. Charlie - 11,800');
});

// Help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  const helpText = `
🎮 *Memorabilia Help*

*How to Play:*
1. Click "Play Game" button
2. Choose difficulty level
3. Match pairs of cards
4. Compete for high scores!

*Commands:*
/start - Start the bot
/play - Open game
/leaderboard - View rankings
/stats - Your statistics
/help - This message

*Support:* @your_support_channel
  `;
  
  bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
});

console.log('Bot is running...');
```

### 6.3 Create .env

```env
BOT_TOKEN=your_bot_token_here
WEB_APP_URL=https://memorabilia.vercel.app
```

### 6.4 Run Bot

```bash
node bot.js
```

### 6.5 Deploy Bot (Optional)

Deploy to Heroku, Railway, or any Node.js hosting:

```bash
# Example: Railway
npm i -g @railway/cli
railway login
railway init
railway up
```

## Step 7: Promote Your Bot

### 7.1 Create Shareable Link

Your bot link:
```
https://t.me/memorabilia_game_bot
```

Direct app link:
```
https://t.me/memorabilia_game_bot/app
```

### 7.2 Share in Communities

- Telegram groups
- Twitter
- Discord
- Reddit

### 7.3 Create Promotional Content

- Screenshots
- Demo video
- Tutorial
- Leaderboard updates

## Troubleshooting

### Bot Not Responding

1. Check bot token is correct
2. Ensure bot is not stopped
3. Check server logs
4. Verify polling is enabled

### Web App Not Opening

1. Check URL is correct and accessible
2. Ensure HTTPS (required for Telegram)
3. Test URL in browser first
4. Check for CORS issues

### User Data Not Available

1. Ensure user has started the bot
2. Check initData is being sent
3. Verify initData validation

### Haptic Feedback Not Working

- Only works in Telegram app
- Not available in web version
- Check device supports haptics

## Security Best Practices

### 1. Validate initData

Always validate Telegram's initData on your backend:

```javascript
const crypto = require('crypto');

function validateInitData(initData, botToken) {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');
  
  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();
  
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  return calculatedHash === hash;
}
```

### 2. Rate Limiting

Implement rate limiting to prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. Environment Variables

Never commit secrets:

```bash
# .gitignore
.env
.env.local
.env.production
```

## Analytics

### Track User Engagement

```javascript
// Track game starts
bot.on('web_app_data', (msg) => {
  const data = JSON.parse(msg.web_app_data.data);
  
  // Log to analytics
  console.log('Game event:', data);
  
  // Send confirmation
  bot.sendMessage(msg.chat.id, 'Score recorded! 🎉');
});
```

### Metrics to Track

- Daily active users
- Games played
- Average score
- Retention rate
- Viral coefficient

## Next Steps

1. ✅ Bot created and configured
2. ✅ Mini App connected
3. ✅ Commands set up
4. 🔄 Test with users
5. 🔄 Gather feedback
6. 🔄 Iterate and improve
7. 🚀 Launch publicly!

## Resources

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [BotFather Commands](https://core.telegram.org/bots#botfather)
- [Telegram Bot Examples](https://github.com/telegram-bot-sdk/examples)

---

Need help? Join our [Discord](https://discord.gg/dojoengine) or [Telegram](https://t.me/memorabilia_support)

