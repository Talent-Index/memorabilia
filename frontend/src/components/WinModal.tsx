import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useGameStore } from '../store/gameStore';
import { calculateStars, calculateGrade, GAME_CONFIGS } from '../types';
import { hapticNotification } from '../telegram/telegram';
import { isScoreEligibleForNFT } from '../cartridge/config';

interface WinModalProps {
  onClose: () => void;
}

export default function WinModal({ onClose }: WinModalProps) {
  const {
    currentGame,
    isWalletConnected,
    isMinting,
    mintTxHash,
    mintError,
    mintNFT,
    clearMintError,
  } = useGameStore();

  useEffect(() => {
    hapticNotification('success');
  }, []);

  if (!currentGame) return null;

  const config = GAME_CONFIGS[currentGame.difficulty];
  const stars = calculateStars(currentGame.moves, config.optimalMoves);
  const grade = calculateGrade(currentGame.score);
  const elapsedTime = Math.floor((Date.now() - currentGame.started_at) / 1000);

  // Check if eligible for NFT minting
  const isEligibleForNFT = isScoreEligibleForNFT(currentGame.score);
  const canMintNFT = isEligibleForNFT && isWalletConnected && !mintTxHash;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMintNFT = async () => {
    clearMintError();
    await mintNFT();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Confetti */}
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />

        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full border-4 border-yellow-500 shadow-2xl"
        >
          {/* Trophy */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-8xl mb-4"
            >
              🏆
            </motion.div>
            <h2 className="text-4xl font-bold gradient-text mb-2">Victory!</h2>
            <p className="text-gray-400">You completed the game!</p>
          </div>

          {/* Stars */}
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3].map((star) => (
              <motion.div
                key={star}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3 + star * 0.1, type: 'spring' }}
                className="text-5xl"
              >
                {star <= stars ? '⭐' : '☆'}
              </motion.div>
            ))}
          </div>

          {/* Grade */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className={`
                inline-block text-6xl font-bold px-6 py-3 rounded-2xl
                ${grade === 'S' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                  grade === 'A' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' :
                  grade === 'B' ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white' :
                  'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                }
              `}
            >
              {grade}
            </motion.div>
          </div>

          {/* Stats */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3">
              <span className="text-gray-400">Score</span>
              <span className="text-2xl font-bold text-yellow-400">{currentGame.score.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3">
              <span className="text-gray-400">Moves</span>
              <span className="text-xl font-bold">
                {currentGame.moves}
                <span className="text-sm text-gray-500 ml-2">
                  (Optimal: {config.optimalMoves})
                </span>
              </span>
            </div>
            
            <div className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3">
              <span className="text-gray-400">Time</span>
              <span className="text-xl font-bold text-blue-400">{formatTime(elapsedTime)}</span>
            </div>
            
            <div className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3">
              <span className="text-gray-400">Difficulty</span>
              <span className="text-xl font-bold text-purple-400">
                {currentGame.difficulty === 1 ? 'Easy' : currentGame.difficulty === 2 ? 'Medium' : 'Hard'}
              </span>
            </div>
          </div>

          {/* NFT Minting Section */}
          {isEligibleForNFT && (
            <div className="mb-6 p-4 bg-gradient-to-r from-orange-900/30 to-purple-900/30 border-2 border-orange-500 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl">🎃</span>
                  <div>
                    <h3 className="font-bold text-orange-400">NFT Eligible!</h3>
                    <p className="text-xs text-gray-400">Score ≥ 10</p>
                  </div>
                </div>
              </div>

              {!isWalletConnected && (
                <p className="text-sm text-yellow-400 mb-3">
                  ⚠️ Connect your wallet to mint NFT
                </p>
              )}

              {mintTxHash && (
                <div className="mb-3 p-3 bg-green-900/30 border border-green-500 rounded-lg">
                  <p className="text-sm text-green-400 font-medium mb-1">✅ NFT Minted!</p>
                  <p className="text-xs text-gray-400 break-all">
                    Tx: {mintTxHash.slice(0, 10)}...{mintTxHash.slice(-8)}
                  </p>
                </div>
              )}

              {mintError && (
                <div className="mb-3 p-3 bg-red-900/30 border border-red-500 rounded-lg">
                  <p className="text-sm text-red-400">❌ {mintError}</p>
                </div>
              )}

              {canMintNFT && (
                <button
                  onClick={handleMintNFT}
                  disabled={isMinting}
                  className={`
                    w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 transform
                    ${isMinting
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 hover:scale-105'
                    }
                  `}
                >
                  {isMinting ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Minting...</span>
                    </span>
                  ) : (
                    'Mint NFT 🎃'
                  )}
                </button>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Play Again
            </button>

            <button
              onClick={() => {
                // TODO: Share score
                alert('Share functionality coming soon!');
              }}
              className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors"
            >
              Share Score 📤
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

