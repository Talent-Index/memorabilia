import { useEffect, useState } from 'react';

export default function TelegramRequired() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if user is on mobile
    const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    setIsMobile(checkMobile);
  }, []);

  const handleOpenInTelegram = () => {
    // Redirect to Telegram bot
    window.location.href = 'https://t.me/memorabilia_game_bot/memorabilia_game';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-8xl mb-4">🎮</div>
          <h1 className="text-4xl font-bold text-white mb-2">Memorabilia</h1>
          <p className="text-purple-200 text-lg">On-chain Memory Game</p>
        </div>

        {/* Message */}
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-3xl">📱</div>
            <div>
              <h2 className="text-white font-semibold text-lg mb-2">
                Telegram Required
              </h2>
              <p className="text-purple-100 text-sm leading-relaxed">
                This game is a Telegram Mini App and must be opened inside the Telegram app.
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4 mb-6">
          <h3 className="text-white font-semibold text-lg">How to play:</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
              <div className="text-2xl">1️⃣</div>
              <div className="flex-1">
                <p className="text-purple-100 text-sm">
                  {isMobile ? (
                    <>Open the <span className="font-semibold text-white">Telegram app</span> on your device</>
                  ) : (
                    <>Install <span className="font-semibold text-white">Telegram</span> on your mobile device</>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
              <div className="text-2xl">2️⃣</div>
              <div className="flex-1">
                <p className="text-purple-100 text-sm">
                  Search for <span className="font-mono bg-purple-500/30 px-2 py-1 rounded text-white">@memorabilia_game_bot</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
              <div className="text-2xl">3️⃣</div>
              <div className="flex-1">
                <p className="text-purple-100 text-sm">
                  Click the <span className="font-semibold text-white">menu button</span> and select <span className="font-semibold text-white">"memorabilia_game"</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
              <div className="text-2xl">4️⃣</div>
              <div className="flex-1">
                <p className="text-purple-100 text-sm">
                  Start playing and <span className="font-semibold text-white">match pairs</span> to win!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleOpenInTelegram}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
        >
          {isMobile ? (
            <>
              <span className="text-xl mr-2">📱</span>
              Open in Telegram
            </>
          ) : (
            <>
              <span className="text-xl mr-2">💻</span>
              View on Mobile
            </>
          )}
        </button>

        {/* Alternative: Copy Link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              navigator.clipboard.writeText('https://t.me/memorabilia_game_bot/memorabilia_game');
              alert('Link copied! Open it in Telegram.');
            }}
            className="text-purple-300 hover:text-white text-sm underline transition-colors"
          >
            📋 Copy Telegram Link
          </button>
        </div>

        {/* Features */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="text-white font-semibold text-sm mb-3">Game Features:</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-purple-200">
              <span>⚡</span>
              <span>3 Difficulty Levels</span>
            </div>
            <div className="flex items-center gap-2 text-purple-200">
              <span>🎨</span>
              <span>Beautiful Animations</span>
            </div>
            <div className="flex items-center gap-2 text-purple-200">
              <span>🔊</span>
              <span>Sound Effects</span>
            </div>
            <div className="flex items-center gap-2 text-purple-200">
              <span>🏆</span>
              <span>Global Leaderboard</span>
            </div>
            <div className="flex items-center gap-2 text-purple-200">
              <span>⛓️</span>
              <span>On-chain Gameplay</span>
            </div>
            <div className="flex items-center gap-2 text-purple-200">
              <span>🎯</span>
              <span>Score Tracking</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-purple-300 text-xs">
          Built with Dojo on Starknet
        </div>
      </div>
    </div>
  );
}

