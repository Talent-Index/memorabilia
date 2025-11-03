import { useGameStore } from '../store/gameStore';
import { shortenAddress } from '../cartridge/config';

export default function WalletButton() {
  const {
    walletAddress,
    isWalletConnected,
    isWalletConnecting,
    walletUsername,
    connectWallet,
    disconnectWallet,
  } = useGameStore();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      // Could show error toast here
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  if (isWalletConnecting) {
    return (
      <button
        disabled
        className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg flex items-center space-x-2 cursor-not-allowed"
      >
        <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Connecting...</span>
      </button>
    );
  }

  if (isWalletConnected && walletAddress) {
    return (
      <div className="flex items-center space-x-2">
        <div className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
          <div className="flex flex-col items-start">
            {walletUsername && (
              <span className="text-xs text-green-100 font-medium">
                {walletUsername}
              </span>
            )}
            <span className="text-sm text-white font-mono">
              {shortenAddress(walletAddress)}
            </span>
          </div>
        </div>
        
        <button
          onClick={handleDisconnect}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
          title="Disconnect Wallet"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg flex items-center space-x-2 transition-all transform hover:scale-105"
    >
      <span className="text-lg">👛</span>
      <span className="text-sm font-medium">Connect Wallet</span>
    </button>
  );
}

