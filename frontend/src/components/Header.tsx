import { useGameStore } from '../store/gameStore';

interface HeaderProps {
  onShowLeaderboard: () => void;
  onBackToDifficulty: () => void;
  currentScreen: string;
}

export default function Header({ onShowLeaderboard, onBackToDifficulty, currentScreen }: HeaderProps) {
  const { telegramUser } = useGameStore();

  return (
    <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🎮</div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Memorabilia</h1>
              <p className="text-xs text-gray-400">On-chain Memory Game</p>
            </div>
          </div>
          
          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            {currentScreen === 'game' && (
              <button
                onClick={onBackToDifficulty}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
              >
                Quit Game
              </button>
            )}
            
            {currentScreen !== 'leaderboard' && (
              <button
                onClick={onShowLeaderboard}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <span>🏆</span>
                <span>Leaderboard</span>
              </button>
            )}
            
            {telegramUser && (
              <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {telegramUser.first_name[0]}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{telegramUser.first_name}</p>
                  {telegramUser.username && (
                    <p className="text-xs text-gray-400">@{telegramUser.username}</p>
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

