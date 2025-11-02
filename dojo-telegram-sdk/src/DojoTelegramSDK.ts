import { TelegramAuth } from './TelegramAuth';
import { BurnerWallet } from './wallet/BurnerWallet';
import { DojoClient } from './dojoClient';
import { TelegramStorage } from './storage/TelegramStorage';
import { SDKConfig, TelegramUser, Account, TxReceipt } from './types';

export class DojoTelegramSDK {
  private auth: TelegramAuth;
  private wallet: BurnerWallet;
  private dojo: DojoClient;
  private storage: TelegramStorage;
  private config: SDKConfig;

  constructor(config: SDKConfig) {
    this.config = config;
    this.auth = new TelegramAuth(config.telegramBotToken);
    this.wallet = new BurnerWallet();
    this.dojo = new DojoClient({ worldAddress: config.dojoWorldAddress, rpcUrl: config.rpcUrl });
    this.storage = new TelegramStorage();
  }

  async initialize(initData?: string) {
    const user: TelegramUser = await this.auth.authenticate(initData);
    // Try to wire into @dojoengine/create-burner if available. Use dynamic import
    // so this prototype still works if packages are not installed.
    try {
      // Dynamic import: suppress TS errors if the package isn't installed in this environment.
      // @ts-ignore
      const mod = await import('@dojoengine/create-burner');
      const createBurner = (mod && (mod.createBurner || mod.default)) as any;
      if (createBurner) {
        // createBurner APIs vary across versions; attempt best-effort initialization.
        const burner = await createBurner({ network: this.config.network, rpcUrl: this.config.rpcUrl });
        // If the returned burner manager has a getOrCreate-like API, prefer it.
        const acct =
          (burner.getOrCreateAccount && (await burner.getOrCreateAccount(user.id))) ||
          (burner.getAccount && (await burner.getAccount(user.id))) ||
          (burner.createAccount && (await burner.createAccount(user))) ||
          null;

        if (acct) {
          // Wrap the burner account into our Account shape if needed
          const wrapped: Account = {
            address: acct.address || acct.accountAddress || acct.addressHex,
            execute: acct.execute || acct.send || (async (tx: any) => acct.invoke?.(tx) || { transaction_hash: '0xUNKNOWN' }),
            callContract: acct.call || acct.callContract || undefined,
          };
          // Replace prototype wallet with a thin adapter
          this.wallet = new BurnerWallet({ externalAccount: wrapped });
          await this.wallet.setupSessionKeys();
          return { user, account: wrapped, dojo: this.dojo };
        }
      }
    } catch (e) {
      // ignore - fall back to prototype wallet
      // console.debug('create-burner not available, using prototype burner', e);
    }

    // Fallback prototype behavior
    const account: Account = await this.wallet.getOrCreate(user.id);
    await this.wallet.setupSessionKeys();
    // Note: in prototype DojoClient does not require connect; real impl should.
    return { user, account, dojo: this.dojo };
  }

  async startGame(account: Account, difficulty: number): Promise<TxReceipt> {
    const tx = await this.dojo.executeWithAccount(account, 'start_game', [difficulty]);
    return tx as TxReceipt;
  }

  async flipCard(account: Account, gameId: number, cardIndex: number): Promise<TxReceipt> {
    const tx = await this.dojo.executeWithAccount(account, 'flip_card', [gameId, cardIndex]);
    return tx as TxReceipt;
  }

  async getGameState(account: Account, gameId: number): Promise<any> {
    // Prototype: no Torii integration; users should query Torii in production.
    if (account.callContract) {
      const res = await account.callContract({ contractAddress: this.config.dojoWorldAddress, entrypoint: 'get_game', calldata: [gameId] });
      return res;
    }
    return null;
  }
}

export default DojoTelegramSDK;
