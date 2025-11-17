import { motion } from 'framer-motion';
import { hapticImpact } from '../telegram/telegram';

interface CardProps {
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function Card({ emoji, isFlipped, isMatched, onClick, disabled }: CardProps) {
  const handleClick = () => {
    if (disabled || isMatched) return;
    hapticImpact('light');
    onClick();
  };

  return (
    <motion.div
      className="aspect-square cursor-pointer"
      whileHover={!disabled && !isMatched ? { scale: 1.05 } : {}}
      whileTap={!disabled && !isMatched ? { scale: 0.95 } : {}}
      onClick={handleClick}
    >
      <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
        <motion.div
          className="w-full h-full relative"
          initial={false}
          animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Card Back (Face Down) */}
          <div
            className="absolute w-full h-full rounded-2xl flex items-center justify-center shadow-lg"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className={`
              w-full h-full rounded-2xl flex items-center justify-center relative overflow-hidden
              bg-gradient-to-br from-museum-bronze-600 via-museum-bronze-500 to-museum-gold-600
              border-4 border-museum-bronze-400/50
              ${!disabled && !isMatched ? 'hover:border-museum-gold-400/70' : ''}
              transition-all duration-200
              shadow-xl
            `}>
              {/* Ancient pattern overlay */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(250,204,21,.3) 10px, rgba(250,204,21,.3) 20px)'
                }}></div>
              </div>

              {/* Museum Logo */}
              <div className="text-5xl sm:text-6xl md:text-7xl filter drop-shadow-lg z-10">
                🏛️
              </div>
            </div>
          </div>

          {/* Card Front (Face Up) */}
          <div
            className="absolute w-full h-full rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className={`
              w-full h-full rounded-2xl flex items-center justify-center relative
              ${isMatched
                ? 'bg-gradient-to-br from-museum-gold-400 via-museum-gold-500 to-museum-bronze-500 border-4 border-museum-gold-300 shadow-museum-gold-500/50'
                : 'bg-gradient-to-br from-museum-sand-100 to-museum-sand-200 border-4 border-museum-stone-300'
              }
              transition-all duration-300
              shadow-xl
            `}>
              {/* Matched effect */}
              {isMatched && (
                <motion.div
                  className="absolute inset-0 bg-museum-gold-300/30 rounded-2xl"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              )}

              {/* Artifact Emoji */}
              <motion.div
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl filter drop-shadow-md z-10"
                initial={false}
                animate={isMatched ? {
                  scale: [1, 1.3, 1],
                  rotate: [0, 15, -15, 0]
                } : {}}
                transition={{ duration: 0.6 }}
              >
                {emoji}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

