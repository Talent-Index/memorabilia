import { Account, RpcProvider, Contract } from 'starknet';
import { BurnerManager } from '@dojoengine/create-burner';
import { dojoConfig, getKatanaAccount } from './config';

export interface DojoContext {
  provider: RpcProvider;
  masterAccount: Account;
  burnerManager: BurnerManager;
}

let dojoContext: DojoContext | null = null;

export async function setupDojo(): Promise<DojoContext> {
  if (dojoContext) {
    return dojoContext;
  }

  console.log('🎮 Setting up Dojo...');
  console.log('RPC URL:', dojoConfig.rpcUrl);
  console.log('World Address:', dojoConfig.worldAddress);

  // Initialize RPC provider
  const provider = new RpcProvider({
    nodeUrl: dojoConfig.rpcUrl,
  });

  // Get master account (for development)
  const katanaAccount = getKatanaAccount(0);
  const masterAccount = new Account(
    provider,
    katanaAccount.address,
    katanaAccount.privateKey,
    '1' // Cairo version
  );

  // Initialize burner manager for session keys
  const burnerManager = new BurnerManager({
    masterAccount,
    accountClassHash: '0x05400e90f7e0ae78bd02c77cd75527280470e2fe19c54970dd79dc37a9d3645c', // Standard account class hash
    rpcProvider: provider,
  });

  dojoContext = {
    provider,
    masterAccount,
    burnerManager,
  };

  console.log('✅ Dojo setup complete!');
  return dojoContext;
}

export function getDojoContext(): DojoContext {
  if (!dojoContext) {
    throw new Error('Dojo not initialized. Call setupDojo() first.');
  }
  return dojoContext;
}

export async function createBurnerAccount(): Promise<Account> {
  const { burnerManager } = getDojoContext();
  
  console.log('🔥 Creating burner account...');
  const burner = await burnerManager.create();
  console.log('✅ Burner account created:', burner.address);
  
  return burner;
}

export async function getBurnerAccounts(): Promise<Account[]> {
  const { burnerManager } = getDojoContext();
  return burnerManager.list();
}

export async function clearBurnerAccounts(): Promise<void> {
  const { burnerManager } = getDojoContext();
  await burnerManager.clear();
  console.log('🗑️ Burner accounts cleared');
}

