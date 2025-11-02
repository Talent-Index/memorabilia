# 🚀 Telegram Mini App Integration - Quick Start Guide

This guide will help you integrate Memorabilia with Telegram Mini Apps in **under 30 minutes**.

---

## 📋 Prerequisites

- [ ] Frontend dev server running (`npm run dev` in `frontend/` directory)
- [ ] Telegram account (mobile or desktop app)
- [ ] ngrok installed (or alternative tunneling service)

---

## ⚡ Quick Setup (3 Steps)

### Step 1: Install ngrok (if not installed)

**Linux/macOS:**
```bash
# Download and install
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok

# Or use snap
sudo snap install ngrok
```

**Alternative: Download directly**
```bash
# Visit https://ngrok.com/download
# Or use wget
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar xvzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin/
```

### Step 2: Expose Your Local Server

**Terminal 1: Start Frontend (if not running)**
```bash
cd /home/daniel/Documents/augment-projects/Memorabilia/frontend
npm run dev
```

**Terminal 2: Start ngrok**
```bash
ngrok http 5173
```

**Expected Output:**
```
ngrok

Session Status                online
Account                       your-account (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:5173

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**📝 IMPORTANT:** Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

### Step 3: Create Telegram Bot

**3.1 Open Telegram and search for `@BotFather`**

**3.2 Create a new bot:**
```
/newbot
```

**3.3 Follow the prompts:**
- **Bot name:** Memorabilia Game
- **Bot username:** memorabilia_game_bot (must end with `_bot`)

**3.4 You'll receive a token:**
```
Done! Congratulations on your new bot.
You will find it at t.me/memorabilia_game_bot
You can now add a description...

Use this token to access the HTTP API:
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

For a description of the Bot API, see this page: https://core.telegram.org/bots/api
```

**📝 Save this token!** You'll need it for `VITE_TELEGRAM_BOT_TOKEN` in `.env`

**3.5 Set up Web App:**
```
/newapp
```

- **Select your bot:** memorabilia_game_bot
- **Title:** Memorabilia
- **Description:** On-chain memory card matching game
- **Photo:** Upload a game screenshot (optional)
- **Demo GIF:** Skip for now
- **Web App URL:** Paste your ngrok HTTPS URL (e.g., `https://abc123.ngrok-free.app`)
- **Short name:** memorabilia

**3.6 Done!** You'll receive:
```
Done! Your Web App memorabilia is now available.
Users can access it via https://t.me/memorabilia_game_bot/memorabilia
```

---

## 🧪 Testing

### Test 1: Open in Telegram

**On Mobile:**
1. Open Telegram
2. Search for your bot: `@memorabilia_game_bot`
3. Tap "Start" or menu button
4. Tap "Memorabilia" to launch the game
5. Game should open inside Telegram (not external browser)

**On Desktop:**
1. Open Telegram Desktop
2. Search for your bot
3. Click the menu button (☰)
4. Click "Memorabilia"
5. Game opens in a modal window

### Test 2: Verify Telegram Detection

**Open Browser Console (F12) and check for:**
```javascript
🎮 Telegram WebApp detected
User: {
  id: 123456789,
  first_name: "Your Name",
  username: "your_username",
  language_code: "en"
}
Theme: {
  bg_color: "#ffffff",
  text_color: "#000000",
  hint_color: "#999999",
  link_color: "#2481cc",
  button_color: "#2481cc",
  button_text_color: "#ffffff"
}
```

### Test 3: Play the Game

1. **Select difficulty** (Easy/Medium/Hard)
2. **Watch preview** (cards show for 1.5 seconds)
3. **Click cards** to flip them
4. **Match pairs** - matched cards stay open
5. **Complete game** - see confetti and score

### Test 4: Verify Features

- [ ] Cards flip with animation
- [ ] Sound effects play (flip, match, mismatch)
- [ ] Matched cards stay open (green gradient)
- [ ] Non-matched cards flip back
- [ ] Score calculates correctly
- [ ] Timer works
- [ ] Win condition triggers

---

## 🔧 Troubleshooting

### Issue: "This site can't be reached"

**Solution:**
- Check frontend is running on port 5173
- Check ngrok is running
- Verify ngrok URL is correct in BotFather

### Issue: "Opens in external browser instead of Telegram"

**Solution:**
- Make sure you used `/newapp` (not `/setwebhook`)
- Verify you're using the Web App link (t.me/bot_name/app_name)
- Try on mobile Telegram (works better than desktop)

### Issue: "Telegram WebApp not detected"

**Solution:**
- Check console for errors
- Verify Telegram SDK is loaded in `index.html`
- Check `src/utils/telegram.ts` initialization
- Try opening from Telegram (not direct URL)

### Issue: "ngrok session expired"

**Solution:**
- Free ngrok URLs expire after 2 hours
- Restart ngrok to get new URL
- Update BotFather with new URL
- Consider ngrok paid plan for static URLs

### Issue: "Game works locally but not in Telegram"

**Solution:**
- Check browser console in Telegram's Web App
- Verify HTTPS (Telegram requires HTTPS)
- Check CORS settings
- Verify no mixed content (HTTP/HTTPS)

---

## 📱 Advanced: Telegram Features

### Enable Haptic Feedback

Add to your code:
```typescript
import { hapticFeedback } from '@/utils/telegram';

// On card flip
hapticFeedback('light');

// On match
hapticFeedback('success');

// On mismatch
hapticFeedback('error');
```

### Use Telegram Theme Colors

```typescript
import { getTelegramTheme } from '@/utils/telegram';

const theme = getTelegramTheme();
// Apply theme.bg_color, theme.text_color, etc.
```

### Save Progress to Telegram Cloud

```typescript
import { saveToCloudStorage, getFromCloudStorage } from '@/utils/telegram';

// Save score
await saveToCloudStorage('highScore', '1500');

// Load score
const highScore = await getFromCloudStorage('highScore');
```

### Show Main Button

```typescript
import { showMainButton, hideMainButton } from '@/utils/telegram';

// Show button
showMainButton('Play Again', () => {
  // Restart game
});

// Hide button
hideMainButton();
```

---

## 🎯 Acceptance Criteria Checklist

Before submitting your PR, verify:

- [ ] ngrok successfully exposes local server
- [ ] Telegram bot created with @BotFather
- [ ] Web App configured with ngrok URL
- [ ] Mini App opens inside Telegram (not external browser)
- [ ] Console shows: `"Telegram WebApp detected"`
- [ ] Console shows Telegram user data (id, username, etc.)
- [ ] Game is fully playable inside Telegram
- [ ] All game features work (flip, match, sound, score)
- [ ] Screenshot of ngrok running attached to PR
- [ ] Screenshot of BotFather configuration attached to PR
- [ ] Screenshot of game running inside Telegram attached to PR
- [ ] Screenshot of browser console showing Telegram detection attached to PR
- [ ] Bot link shared for team testing

---

## 📸 Screenshots to Include in PR

### 1. ngrok Running
```
Terminal showing:
Forwarding    https://abc123.ngrok-free.app -> http://localhost:5173
```

### 2. BotFather Configuration
```
Telegram chat with @BotFather showing:
- Bot created
- Web App URL set
- Web App link
```

### 3. Game in Telegram
```
Screenshot of:
- Telegram app (mobile or desktop)
- Game running inside Telegram
- Cards visible and playable
```

### 4. Console Detection
```
Browser console showing:
🎮 Telegram WebApp detected
User: { id: ..., first_name: "...", ... }
```

---

## 🔗 Useful Links

- **Telegram Bot API:** https://core.telegram.org/bots/api
- **Telegram Mini Apps:** https://core.telegram.org/bots/webapps
- **ngrok Documentation:** https://ngrok.com/docs
- **Dojo Telegram Guide:** https://dojoengine.org/client/sdk/telegram

---

## ⏱️ Time Estimate

- **ngrok setup:** 5 minutes
- **Bot creation:** 10 minutes
- **Testing:** 10 minutes
- **Screenshots:** 5 minutes
- **Total:** ~30 minutes

---

## 🎉 Success!

Once you see the game running inside Telegram with all features working, you've successfully completed Task 2!

**Next Steps:**
1. Take all required screenshots
2. Create PR using the template
3. Fill out Task 2 acceptance criteria
4. Attach screenshots
5. Share bot link with team
6. Request review

---

## 💡 Pro Tips

✅ **Use mobile Telegram** - Better Web App support than desktop  
✅ **Keep ngrok running** - Don't close the terminal  
✅ **Test on multiple devices** - iOS, Android, Desktop  
✅ **Share bot link early** - Let team test while you work  
✅ **Document issues** - Note any bugs for later fixes  
✅ **Test all features** - Don't just check if it opens  

---

**Need help?** Check the troubleshooting section or ask in team chat!

**Ready to start?** Follow the 3 steps above and you'll have Telegram integration working in 30 minutes! 🚀

