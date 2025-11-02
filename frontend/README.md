# 🎮 Memorabilia Frontend

Beautiful web interface for the Memorabilia on-chain memory game.

## Features

✨ **Beautiful UI**
- Smooth card flip animations
- Gradient backgrounds
- Responsive design
- Dark theme optimized for Telegram

🎯 **Game Features**
- 3 difficulty levels (Easy, Medium, Hard)
- Real-time score tracking
- Move counter and timer
- Progress bar
- Win celebration with confetti

📱 **Telegram Integration**
- Telegram Mini App support
- Haptic feedback
- Theme adaptation
- User authentication

⚡ **Blockchain Integration**
- Dojo SDK integration
- Burner accounts for gasless gameplay
- Real-time state updates
- Smart contract interactions

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set:
```env
VITE_RPC_URL=http://localhost:5050
VITE_TORII_URL=http://localhost:8080
VITE_WORLD_ADDRESS=0x... # Your deployed world address
VITE_NETWORK=katana
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Card.tsx        # Card component with flip animation
│   │   ├── GameBoard.tsx   # Main game board
│   │   ├── DifficultySelector.tsx
│   │   ├── WinModal.tsx    # Victory screen
│   │   ├── Leaderboard.tsx # Leaderboard view
│   │   ├── Header.tsx      # App header
│   │   └── LoadingScreen.tsx
│   │
│   ├── dojo/               # Dojo integration
│   │   ├── config.ts       # Configuration
│   │   ├── setup.ts        # Dojo setup
│   │   └── gameController.ts # Game logic
│   │
│   ├── telegram/           # Telegram integration
│   │   └── telegram.ts     # Telegram WebApp API
│   │
│   ├── store/              # State management
│   │   └── gameStore.ts    # Zustand store
│   │
│   ├── types/              # TypeScript types
│   │   └── index.ts        # Type definitions
│   │
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
│
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Building for Production

### Build

```bash
npm run build
```

Output will be in `dist/` directory.

### Preview

```bash
npm run preview
```

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Environment Variables

Set these in your hosting platform:

- `VITE_RPC_URL` - Starknet RPC URL
- `VITE_TORII_URL` - Torii indexer URL
- `VITE_WORLD_ADDRESS` - Deployed world contract address
- `VITE_NETWORK` - Network (katana/sepolia/mainnet)

## Telegram Mini App Setup

### 1. Create Bot

Talk to [@BotFather](https://t.me/botfather):

```
/newbot
# Follow prompts

/newapp
# Select your bot
# Provide app details
```

### 2. Configure Web App URL

After deploying, set your URL:

```
/myapps
# Select your app
# Edit -> Web App URL
# Enter: https://your-app.vercel.app
```

### 3. Test

Open your bot in Telegram and click the app button!

## Development Tips

### Hot Reload

Vite provides instant hot reload. Changes appear immediately.

### Debugging

Open browser DevTools:
- Console: See logs from Dojo and game logic
- Network: Monitor RPC calls
- React DevTools: Inspect component state

### Mock Data

The app includes mock data for development:
- Mock Telegram user (when not in Telegram)
- Mock leaderboard entries
- Mock game state

### Testing Telegram Features

Use ngrok to test locally in Telegram:

```bash
# Install ngrok
npm i -g ngrok

# Start dev server
npm run dev

# In another terminal
ngrok http 3000

# Use ngrok URL in Telegram bot settings
```

## Customization

### Colors

Edit `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: { ... },
      telegram: { ... },
    }
  }
}
```

### Animations

Edit `tailwind.config.js` keyframes or use Framer Motion in components.

### Card Emojis

Edit `src/types/index.ts`:

```ts
export const CARD_EMOJIS = [
  '🎮', '🎯', '🎲', // Add your emojis
];
```

## Troubleshooting

### "Failed to connect to RPC"

- Check `VITE_RPC_URL` is correct
- Ensure Katana is running: `katana --disable-fee`
- Check network connectivity

### "World address not set"

- Deploy contracts first: `sozo migrate apply`
- Copy world address to `.env`
- Restart dev server

### "Telegram WebApp not found"

- Normal when testing outside Telegram
- App uses mock user for development
- Test in Telegram for full experience

### Build Errors

```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

## Performance

### Optimization Tips

1. **Lazy Loading**: Components are loaded on demand
2. **Memoization**: Use React.memo for expensive components
3. **Debouncing**: Card flips are debounced
4. **Caching**: RPC calls are cached where possible

### Bundle Size

Current bundle size: ~500KB (gzipped)

To analyze:

```bash
npm run build
npx vite-bundle-visualizer
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

MIT

## Support

- Documentation: See main README.md
- Issues: GitHub Issues
- Discord: [Dojo Discord](https://discord.gg/dojoengine)

---

Built with ❤️ using React, Vite, Tailwind CSS, and Dojo

