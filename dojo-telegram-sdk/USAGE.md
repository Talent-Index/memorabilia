# Dojo Telegram SDK Prototype — Usage

This scaffold provides a minimal SDK prototype for local/demo use.

Quick start

```bash
cd dojo-telegram-sdk
npm ci
npm run build
```

Example (pseudo-code)

```ts
import DojoTelegramSDK from './dist/DojoTelegramSDK';

const sdk = new DojoTelegramSDK({
  telegramBotToken: process.env.BOT_TOKEN || 'demo',
  dojoWorldAddress: process.env.WORLD_ADDRESS || '0xDEMO',
  rpcUrl: process.env.VITE_RPC_URL || 'http://localhost:5050',
});

const { user, account } = await sdk.initialize();
const tx = await sdk.startGame(account, 1);
console.log('tx', tx.transaction_hash);
```

Notes
- This prototype uses a mocked burner wallet and in-memory storage.
- Replace `BurnerWallet` and `DojoClient` with real `@dojoengine/create-burner` and `@dojoengine/torii-client` usage in production.

Optional: enable real Dojo integrations
- Install the Dojo helper packages (already added to package.json):

```bash
npm ci
```

- If you have a Torii indexer running, pass `toriiUrl` in the SDK config to enable `subscribeGameEvents`.

Example with Torii and real burner (after installing dependencies):

```ts
import DojoTelegramSDK from './dist/DojoTelegramSDK';

const sdk = new DojoTelegramSDK({
  telegramBotToken: process.env.BOT_TOKEN || 'demo',
  dojoWorldAddress: process.env.WORLD_ADDRESS || '0xDEMO',
  rpcUrl: process.env.VITE_RPC_URL || 'http://localhost:5050',
  toriiUrl: process.env.TORII_URL || 'http://localhost:8080',
  network: 'katana',
});

const { user, account, dojo } = await sdk.initialize();
// If torii is available you can subscribe to game events:
// dojo.subscribeGameEvents(123, ev => console.log('game event', ev));
```
