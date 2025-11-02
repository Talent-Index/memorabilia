# Example: Using the prototype SDK

This small example shows how to wire a burner `Account` from frontend into the SDK's `DojoClient` to call `start_game`.

Note: The example is illustrative; real `Account` instances are created with `@dojoengine/create-burner`.

1. Build SDK:

```bash
cd dojo-telegram-sdk
npm ci
npm run build
```

2. Example usage (pseudo-code):

```ts
import { DojoClient } from '../dojo-telegram-sdk/dist/dojoClient';

const dojo = new DojoClient({ worldAddress: process.env.WORLD_ADDRESS, rpcUrl: process.env.VITE_RPC_URL });

// `burnerAccount` is created in frontend via BurnerManager
await dojo.executeWithAccount(burnerAccount, 'start_game', [1]);
```
