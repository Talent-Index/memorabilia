import { DojoClient } from '../src/dojoClient';
import { TelegramAuthenticator } from '../src/auth';

// This example assumes you have a pre-funded Account object from your frontend / burner.
// In Node tests you will mock the account.

async function main() {
  const dojo = new DojoClient({
    worldAddress: '0xWORLDADDRESS',
    rpcUrl: 'http://localhost:5050',
  });

  console.log('Dojo client ready (provider may be undefined in this environment).');

  // Example: you would call dojo.startGame(account, 1) in your UI code.
}

main().catch(console.error);