
import React from 'react';
import { motion } from 'framer-motion';
import { ASSETS } from '../constants';

interface Props {
  onStart: () => void;
  onDebugEnding3?: () => void;
}

const SafeImage = ({ src, alt, className, fallbackColor = '000', ...props }: any) => {
    return (
      <img 
        {...props}
        src={src} 
        alt={alt}
        className={className}
        onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/1920x1080/${fallbackColor}/ffffff/png?text=${encodeURIComponent(alt || 'BG')}`;
        }}
      />
    );
};

export const HomeScene: React.FC<Props> = ({ onStart, onDebugEnding3 }) => {
  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col justify-center items-start pl-10 md:pl-32">
       {/* Background */}
       <SafeImage 
          src={ASSETS.home} 
          className="absolute inset-0 w-full h-full object-cover opacity-80" 
          alt="Home Background"
       />
       
       {/* Title */}
       <motion.div 
         initial={{ opacity: 0, x: -50 }}
         animate={{ opacity: 1, x: 0 }}
         transition={{ duration: 1.5 }}
         className="z-10 text-[#d4af37] drop-shadow-2xl"
       >
          <h1 className="text-6xl md:text-9xl font-title tracking-widest uppercase mb-4 border-b-2 border-[#d4af37] pb-4 inline-block">
            Panacea
          </h1>
          
       </motion.div>

       {/* Start Button */}
       <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          onClick={onStart}
          className="z-10 mt-16 px-10 py-4 border-2 border-[#d4af37] text-[#d4af37] text-xl font-title tracking-[0.2em] uppercase hover:bg-[#d4af37] hover:text-[#0d1b1e] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer"
       >
          Start Game
       </motion.button>
       
       {/* Debug Button */}
       {onDebugEnding3 && (
           <button 
             onClick={onDebugEnding3}
             className="hidden absolute bottom-4 left-4 z-50 text-xs text-[#d4af37]/30 hover:text-[#d4af37] border border-[#d4af37]/20 px-2 py-1 rounded"
           >
             Debug: Ending 3
           </button>
       )}
    </div>
  );
};
