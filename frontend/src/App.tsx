import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { setupDojo, createBurnerAccount } from './dojo/setup';
import { createGameController } from './dojo/gameController';
import { initTelegramApp, getTelegramUser, getThemeColors, isTelegramWebApp } from './telegram/telegram';

// Components
import LoadingScreen from './components/LoadingScreen';
import DifficultySelector from './components/DifficultySelector';
import GameBoard from './components/GameBoard';
import WinModal from './components/WinModal';
import Header from './components/Header';
import Leaderboard from './components/Leaderboard';
import TelegramRequired from './components/TelegramRequired';
import UserDashboard from './components/UserDashboard';
import Waves from './components/Waves';

type Screen = 'loading' | 'difficulty' | 'game' | 'leaderboard' | 'dashboard';

function App() {
  const [screen, setScreen] = useState<Screen>('loading');
  const [isInitializing, setIsInitializing] = useState(true);
  
  const {
    setTelegramUser,
    setAccount,
    setGameController,
    currentGame,
    showWinModal,
    resetGame,
  } = useGameStore();

  // Initialize app
  useEffect(() => {
    async function initialize() {
      try {
        console.log('🚀 Initializing Memorabilia...');

        // Initialize Telegram
        const telegramUser = initTelegramApp();
        const user = telegramUser || getTelegramUser();
        setTelegramUser(user);

        // Apply Telegram theme
        const themeColors = getThemeColors();
        document.documentElement.style.setProperty('--tg-bg-color', themeColors.bgColor);
        document.documentElement.style.setProperty('--tg-text-color', themeColors.textColor);

        // Check if we have a world address (blockchain mode) or demo mode
        const worldAddress = import.meta.env.VITE_WORLD_ADDRESS;
        const isDemoMode = !worldAddress || worldAddress === '0x' || worldAddress === '';

        if (isDemoMode) {
          console.log('🎮 Running in DEMO MODE (no blockchain required)');
          console.log('💡 To enable blockchain features, deploy contracts and set VITE_WORLD_ADDRESS in .env');

          // Skip Dojo setup in demo mode
          setIsInitializing(false);
          setScreen('difficulty');
        } else {
          console.log('⛓️ Running in BLOCKCHAIN MODE');

          // Setup Dojo
          await setupDojo();

          // Create burner account for session
          const burnerAccount = await createBurnerAccount();
          setAccount(burnerAccount);

          // Create game controller
          const controller = createGameController(burnerAccount);
          setGameController(controller);

          console.log('✅ Blockchain initialization complete!');

          setIsInitializing(false);
          setScreen('difficulty');
        }
      } catch (error) {
        console.error('❌ Initialization failed:', error);
        console.log('🎮 Falling back to DEMO MODE');
        setIsInitializing(false);
        setScreen('difficulty');
      }
    }

    initialize();
  }, [setTelegramUser, setAccount, setGameController]);

  // Handle game state changes
  useEffect(() => {
    if (currentGame && screen !== 'game') {
      setScreen('game');
    }
  }, [currentGame, screen]);

  // Handle win modal close
  const handleWinModalClose = () => {
    resetGame();
    setScreen('difficulty');
  };

  // Handle navigation
  const handleShowLeaderboard = () => {
    setScreen('leaderboard');
  };

  const handleShowDashboard = () => {
    setScreen('dashboard');
  };

  const handleBackToDifficulty = () => {
    if (currentGame) {
      // Show confirmation
      if (confirm('Are you sure you want to quit the current game?')) {
        resetGame();
        setScreen('difficulty');
      }
    } else {
      setScreen('difficulty');
    }
  };

  // Check if running in Telegram
  const isInTelegram = isTelegramWebApp();

  // Show Telegram required screen if not in Telegram
  if (!isInTelegram) {
    return <TelegramRequired />;
  }

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-museum-blue-100 via-museum-blue-500 to-museum-blue-200 text-[#F1FFE7] relative">
      <Waves
        lineColor="rgba(255, 255, 255, 0.2)"
        backgroundColor="#32373B"
        waveSpeedX={0.0125}
        waveSpeedY={0.005}
        waveAmpX={32}
        waveAmpY={16}
        xGap={10}
        yGap={32}
        friction={0.925}
        tension={0.005}
        maxCursorMove={100}
      />
      <div className="relative z-10">
        <Header
          onShowLeaderboard={handleShowLeaderboard}
          onBackToDifficulty={handleBackToDifficulty}
          onShowDashboard={handleShowDashboard}
          currentScreen={screen}
        />

        <main className="container mx-auto px-4 py-8">
          {screen === 'difficulty' && (
            <DifficultySelector onStart={() => setScreen('game')} />
          )}

          {screen === 'game' && currentGame && (
            <GameBoard />
          )}

          {screen === 'leaderboard' && (
            <Leaderboard onBack={handleBackToDifficulty} />
          )}

          {screen === 'dashboard' && (
            <UserDashboard />
          )}
        </main>

        {showWinModal && (
          <WinModal onClose={handleWinModalClose} />
        )}
      </div>
    </div>
  );
}

export default App;

