
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ASSETS, HERBS, DESCRIPTIONS } from '../constants';
import { GameState, CharacterId, GamePhase, HerbId } from '../types';

interface Props {
  gameState: GameState;
  onHerbDragStart: (e: React.DragEvent, id: string) => void; // Changed ID type to string
  onPotDrop: (e: React.DragEvent) => void;
  onPotClick: () => void; 
  onHerbClick: (id: string) => void; // Changed ID type to string
  isShaking?: boolean;
}

// Utility Component to handle image fallbacks
const SafeImage = ({ src, alt, className, fallbackColor = '333', ...props }: any) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleError = () => {
    console.warn(`Failed to load image: ${src}. Falling back to placeholder.`);
    setImgSrc(`https://placehold.co/400x400/${fallbackColor}/ffffff/png?text=${encodeURIComponent(alt || 'Asset')}`);
  };

  return (
    <img 
      {...props}
      src={imgSrc} 
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

export const GameScene: React.FC<Props> = ({ gameState, onHerbDragStart, onPotDrop, onPotClick, onHerbClick, isShaking }) => {
  const [hoverDescription, setHoverDescription] = useState<string | null>(null);
  
  // Main Character Glitch State
  const [currentMainImage, setCurrentMainImage] = useState(ASSETS.characters[CharacterId.MAIN]);


useEffect(() => {
  if (gameState.day === 4) {
    setCurrentMainImage(ASSETS.characters[CharacterId.MAIN_ANGRY]);
    return;
  }

  const interval = setInterval(() => {
    // 切換眨眼或 glitch
    setCurrentMainImage(ASSETS.characters[CharacterId.MAIN_GLITCH]);
    setTimeout(() => {
      setCurrentMainImage(ASSETS.characters[CharacterId.MAIN]);
    }, 200);
  }, 6000);

  return () => clearInterval(interval);
}, [gameState.day]);


  // Only show tooltips during BREWING phase
  const handleMouseEnter = (textOrObj: string | any) => {
    if (gameState.phase !== GamePhase.BREWING) return;

    let text = "";
    if (typeof textOrObj === 'string') {
        text = textOrObj;
    } else if (textOrObj) {
        // Handle dynamic descriptions
        if (gameState.day === 4 && textOrObj.day4) {
             text = textOrObj.day4;
        } else if (gameState.day === 2 && textOrObj.day2) {
             text = textOrObj.day2;
        } else if (textOrObj.day1) {
             text = textOrObj.day1;
        } else if (textOrObj.default) {
             text = textOrObj.default;
        }
    }
    if (text) setHoverDescription(text);
  };
  const handleMouseLeave = () => setHoverDescription(null);

  // Filter only the first 5 herbs
  const DISPLAY_HERBS = HERBS.slice(0, 5);
  
  const isDay4Brewing = gameState.day === 4 && gameState.phase === GamePhase.BREWING;

  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${isShaking ? 'animate-[shake_0.5s_cubic-bezier(.36,.07,.19,.97)_both]' : ''}`}>
      <style>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
      
      {/* Narrative Blackout Overlay (For specific scenes like being dragged out) */}
      <AnimatePresence>
        {gameState.isBlackout && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-black z-[45] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Hover Description Display (Top Center) */}
      <AnimatePresence>
        {hoverDescription && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
          >
            <div className="bg-black/60 text-[#e2d2a4] px-8 py-4 rounded-xl border border-[#d4af37]/50 backdrop-blur-sm font-serif text-l md:text-xl tracking-wide shadow-lg whitespace-pre-line text-center">
              {hoverDescription}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guest (Z-0) - Behind Background (Z-5) */}
      {gameState.currentGuest && (
        <div
          className={`absolute top-[25%] z-0 pointer-events-none ${gameState.day === 2 || gameState.day === 3? 'right-[5%]' : 'right-[5%]'}`}
        >
           <SafeImage 
              src={ASSETS.characters[gameState.currentGuest]} 
              className="h-[55vh] object-contain drop-shadow-xl brightness-90" 
              alt="Guest"
              fallbackColor="5d4037"
           />
        </div>
      )}

      {/* Background Layer (Z-5) - Moved above guest */}
      <SafeImage 
        src={ASSETS.background} 
        alt="Cabin" 
        className="absolute inset-0 w-full h-full object-cover opacity-100 z-5"
        fallbackColor="0d1b1e"
      />
      
      {/* Interactive Background Objects */}
      
      {/* Mirror - Moved right to left-[30%] */}
      <div 
        className={`absolute top-[48%] left-[35%] w-16 md:w-24 h-32 md:h-40 opacity-90 hover:brightness-125 transition-all z-10 ${isDay4Brewing ? 'cursor-pointer animate-pulse hover:scale-110' : 'cursor-default'}`}
        draggable={isDay4Brewing}
        onDragStart={(e) => onHerbDragStart(e, 'mirror')}
        onMouseEnter={() => handleMouseEnter(DESCRIPTIONS.mirror)}
        onMouseLeave={handleMouseLeave}
      >
         <SafeImage src={ASSETS.mirror} className="w-full h-full object-contain" alt="Mirror" fallbackColor="333" />
      </div>
      
      {/* Right Edge Exit Zone */}
      <div
        className="absolute top-0 right-0 h-full w-[15%] cursor-pointer z-30"
        onMouseEnter={() => handleMouseEnter(DESCRIPTIONS.exit)}
        onMouseLeave={handleMouseLeave}
        onClick={() => { /* Placeholder for future exit logic */ }}
      ></div>
      
      {/* Scene Items (Dropped items like Feather, Dagger, Broom, Book) */}
      
      {/* Broom - Day 4 */}
      {gameState.sceneItems.includes('broom') && (
        <div 
            className={`absolute bottom-[10%] left-[10%] w-24 h-48 z-30 hover:brightness-125 transition-all ${isDay4Brewing ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
            draggable={isDay4Brewing}
            onDragStart={(e) => onHerbDragStart(e, 'broom')}
            onMouseEnter={() => handleMouseEnter(DESCRIPTIONS.broom)}
            onMouseLeave={handleMouseLeave}
        >
             <SafeImage src={ASSETS.broom} className="w-full h-full object-contain drop-shadow-[0_0_10px_black]" alt="Broom" />
        </div>
      )}

      {/* Book - Day 4 */}
      {gameState.sceneItems.includes('book') && (
        <div 
            className={`hidden absolute top-[40%] right-[10%] w-20 h-24 z-30 hover:brightness-125 transition-all rotate-12 ${isDay4Brewing ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
            draggable={isDay4Brewing}
            onDragStart={(e) => onHerbDragStart(e, 'book')}
            onMouseEnter={() => handleMouseEnter(DESCRIPTIONS.book)}
            onMouseLeave={handleMouseLeave}
        >
             <SafeImage src={ASSETS.book} className="w-full h-full object-contain drop-shadow-[0_0_5px_gold]" alt="Book" />
        </div>
      )}

      {/* Feather */}
      {gameState.sceneItems.includes('feather') && (
        <div 
            className={`absolute bottom-[40%] left-[30%] w-16 h-16 z-30 hover:brightness-125 transition-all ${isDay4Brewing ? 'cursor-pointer hover:drop-shadow-[0_0_10px_white]' : 'cursor-default'}`}
            draggable={isDay4Brewing}
            onDragStart={(e) => onHerbDragStart(e, 'feather')}
            onMouseEnter={() => handleMouseEnter(DESCRIPTIONS.feather)}
            onMouseLeave={handleMouseLeave}
        >
            <SafeImage src={ASSETS.feather} className="w-full h-full object-contain drop-shadow-[0_0_10px_gold]" alt="Feather" />
        </div>
      )}

      {/* Dagger */}
      {gameState.sceneItems.includes('dagger') && (
        <div 
            className={`absolute bottom-[25%] right-[70%] w-20 h-20 z-30 hover:brightness-125 transition-all rotate-45 ${isDay4Brewing ? 'cursor-pointer hover:drop-shadow-[0_0_10px_red]' : 'cursor-default'}`}
            draggable={isDay4Brewing}
            onDragStart={(e) => onHerbDragStart(e, 'dagger')}
            onMouseEnter={() => handleMouseEnter(DESCRIPTIONS.dagger)}
            onMouseLeave={handleMouseLeave}
        >
             <SafeImage src={ASSETS.dagger} className="w-full h-full object-contain drop-shadow-[0_0_10px_red]" alt="Dagger" />
        </div>
      )}

      {/* Mist Overlay (Z-10) */}
      <div className="absolute inset-0 bg-[#0d1b1e] opacity-30 pointer-events-none z-10"></div>

      {/* Main Character (Z-20) - Glitching Image */}
      <div className="absolute bottom-[10%] left-[50%] z-20 pointer-events-none">
        <SafeImage 
            src={currentMainImage} 
            className="h-[65vh] object-contain drop-shadow-2xl" 
            alt="Witch"
            fallbackColor="8c7335"
        />
      </div>

      {/* Herbs Display (No Shelf) (Z-25) */}
      <div className="absolute left-9 top-20 bottom-32 w-80 md:w-[32rem] flex flex-col items-center z-25">
          <div className="grid grid-cols-2 gap-4 h-full content-start w-full">
            {DISPLAY_HERBS.map((herb, index) => (
              <div 
                key={herb.id}
                draggable
                onDragStart={(e) => onHerbDragStart(e, herb.id)}
                onClick={() => onHerbClick(herb.id)}
                onMouseEnter={() => handleMouseEnter(`${herb.name}\n${herb.description}`)}
                onMouseLeave={handleMouseLeave}
                className={`relative group cursor-pointer hover:scale-105 transition-transform
                   ${index === 0 ? 'col-span-2 row-span-2 aspect-[2/1]' : 'aspect-square'} 
                `
                
                }
                style={{ top: `${herb.offsetY}%`, left: `${herb.offsetX}%`, width: '4rem', height: '4rem' }}
              >
                <SafeImage src={herb.image} className="w-full h-full object-contain drop-shadow-md" alt={herb.name} fallbackColor="2e7d32" />
              </div>
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square cursor-pointer opacity-0"></div>
            ))}
          </div>
      </div>

      {/* Window (Z-30) - HIDDEN */}
      <div 
        className="hidden absolute top-1/2 right-0 transform -translate-y-1/2 z-30 h-[80vh] w-auto pointer-events-none"
      >
         <SafeImage src={ASSETS.window} className="h-full w-auto opacity-90 object-contain" alt="Window" fallbackColor="2a4045" />
      </div>

      {/* Cat (Z-25) */}
      <div 
        className={`absolute bottom-5 left-[30%] z-25 w-24 md:w-32 hover:brightness-110 transition-all ${isDay4Brewing ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        draggable={isDay4Brewing}
        onDragStart={(e) => onHerbDragStart(e, 'cat')}
        onMouseEnter={() => handleMouseEnter(DESCRIPTIONS.cat)}
        onMouseLeave={handleMouseLeave}
      >
        <SafeImage src={ASSETS.characters[CharacterId.CAT]} className="w-full opacity-100" alt="Cat" fallbackColor="000000" />
      </div>

      {/* Cauldron (Z-40) */}
      <div 
        className={`absolute bottom-[0rem] left-[45%] z-40 transition-all duration-300 cursor-pointer opacity-1 ${gameState.phase === GamePhase.BREWING ? 'scale-100 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]' : 'scale-100'}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onPotDrop}
        onClick={onPotClick}
        onMouseEnter={() => handleMouseEnter(DESCRIPTIONS.cauldron)}
        onMouseLeave={handleMouseLeave}
      >
        <SafeImage src={ASSETS.cauldron} className="w-64 md:w-96 opacity-100" alt="Cauldron" fallbackColor="1a1a1a" />
        
        {/* Ingredients inside (Names) - Moved Up to top-[20%] */}
        <div className="absolute top-[70%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 w-60">
            {gameState.potionsBrewed.map((id, idx) => {
                // Check herbs first
                let displayName = '???';
                const herb = HERBS.find(h => h.id === id);
                if (herb) {
                    displayName = herb.name;
                } else {
                    // Check other items
                    switch(id) {
                        case 'cat': displayName = '黑貓'; break;
                        case 'broom': displayName = '掃帚'; break;
                        case 'book': displayName = '藥草誌'; break;
                        case 'feather': displayName = '尾羽'; break;
                        case 'dagger': displayName = '匕首'; break;
                        case 'mirror': displayName = '鏡子'; break;
                        default: displayName = id;
                    }
                }

                return (
                    <motion.div 
                        key={idx}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-[#d4af37] text-lg md:text-xl font-serif bg-black/70 px-3 py-1 rounded border border-[#d4af37]/30 shadow-md whitespace-nowrap"
                    >
                        {displayName}
                    </motion.div>
                );
            })}
        </div>
      </div>
      
      {/* Brewing Controls */}
      {gameState.phase === GamePhase.BREWING && (
          <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
          </div>
      )}

    </div>
  );
};
