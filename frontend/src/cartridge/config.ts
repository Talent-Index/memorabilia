/**
 * Cartridge Controller Configuration
 * 
 * Configuration for Cartridge Controller wallet connection and session policies
 * for Starknet Sepolia testnet.
 */

// NFT Contract Address (update after deployment)
// Using placeholder address until contracts are deployed
export const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT_ADDRESS || '0x1';

// World Contract Address
export const WORLD_ADDRESS = import.meta.env.VITE_WORLD_ADDRESS || '0x1';

/**
 * Cartridge Controller Configuration
 */
export const CARTRIDGE_CONFIG = {
  // Network configuration
  network: 'sepolia' as const,
  rpcUrl: 'https://api.cartridge.gg/x/starknet/sepolia',
  chainId: 'SN_SEPOLIA' as const,
  
  // App configuration
  appId: 'memorabilia',
  appName: 'Memorabilia',
  appIcon: '🎮',
  
  // Session policies for gasless transactions
  policies: [
    {
      target: NFT_CONTRACT_ADDRESS,
      method: 'mint_score_nft',
      description: 'Mint NFT for high scores (score >= 10)',
    },
  ],
  
  // Session configuration
  session: {
    expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    publicKey: '', // Will be generated
  },
};

/**
 * Cartridge Controller CDN URLs
 */
export const CARTRIDGE_CDN = {
  controller: 'https://unpkg.com/@cartridge/controller@latest',
  starknet: 'https://unpkg.com/starknet@latest',
};

/**
 * NFT Minting Configuration
 */
export const NFT_CONFIG = {
  minScore: 10, // Minimum score required to mint NFT
  contractAddress: NFT_CONTRACT_ADDRESS,
  entrypoint: 'mint_score_nft',
};

/**
 * Helper function to check if NFT contract is configured
 */
export function isNFTContractConfigured(): boolean {
  return NFT_CONTRACT_ADDRESS !== '0x0' && NFT_CONTRACT_ADDRESS !== '0x1' && NFT_CONTRACT_ADDRESS !== '';
}

/**
 * Helper function to check if score is eligible for NFT
 */
export function isScoreEligibleForNFT(score: number): boolean {
  return score >= NFT_CONFIG.minScore;
}

/**
 * Helper function to shorten wallet address
 */
export function shortenAddress(address: string): string {
  if (!address) return '';
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

