import { useGameStore } from '../store/gameStore';
import WalletButton from './WalletButton';

interface HeaderProps {
  onShowLeaderboard: () => void;
  onBackToDifficulty: () => void;
  onShowDashboard: () => void;
  currentScreen: string;
}

export default function Header({ onShowLeaderboard, onBackToDifficulty, onShowDashboard, currentScreen }: HeaderProps) {
  const { telegramUser } = useGameStore();
  
  return (
    <header className="bg-museum-stone-800/90 backdrop-blur-lg border-b border-museum-bronze-300 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🏛️</div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-museum-gold-400 to-museum-bronze-500 bg-clip-text text-transparent">
                Time-Travel Museum
              </h1>
              <p className="text-xs text-museum-sand-300">Discover artifacts from different eras</p>
            </div>
          </div>
          
          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            {/* Wallet Connection Button */}
            <WalletButton />

            {currentScreen === 'game' && (
              <button
                onClick={onBackToDifficulty}
                className="px-4 py-2 bg-museum-bronze-600 hover:bg-museum-bronze-700 rounded-lg text-sm font-medium text-white transition-colors shadow-lg"
              >
                Leave Gallery
              </button>
            )}

            {currentScreen !== 'leaderboard' && (
              <button
                onClick={onShowLeaderboard}
                className="px-4 py-2 bg-museum-gold-500 hover:bg-museum-gold-600 rounded-lg text-sm font-medium text-museum-stone-900 transition-colors flex items-center space-x-2 shadow-lg"
              >
                <span>🏆</span>
                <span>Hall of Fame</span>
              </button>
            )}

            {currentScreen !== 'dashboard' && (
              <button
                onClick={onShowDashboard}
                className="px-4 py-2 bg-museum-blue-600 hover:bg-museum-blue-700 rounded-lg text-sm font-medium text-white transition-colors flex items-center space-x-2 shadow-lg"
              >
                <span>📊</span>
                <span>Dashboard</span>
              </button>
            )}

            {telegramUser && (
              <div className="flex items-center space-x-2 bg-museum-stone-700/80 px-3 py-2 rounded-lg border border-museum-bronze-400/30">
                <div className="w-8 h-8 bg-museum-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {telegramUser.first_name[0]}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-museum-sand-100">{telegramUser.first_name}</p>
                  {telegramUser.username && (
                    <p className="text-xs text-museum-sand-400">@{telegramUser.username}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

