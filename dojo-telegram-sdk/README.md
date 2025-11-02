# Dojo-Telegram SDK (prototype)

Minimal SDK prototype for integrating Telegram Mini Apps with a Dojo World on StarkNet.

Quick start:
1. Install deps:
   npm ci

2. Build:
   npm run build

3. Run tests:
   npm test

Notes:
- Tests run in Node and mock starknet Account/provider; production code must encode calldata per contract ABI.
- Auth uses Telegram login verification algorithm (HMAC-SHA256 with secret=SHA256(bot_token)).
