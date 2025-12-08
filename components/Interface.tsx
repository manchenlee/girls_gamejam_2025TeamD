import React, { useState, useEffect, useRef } from 'react';
import { Book, Scroll, History, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState, ScriptNode } from '../types';
import { JOURNAL_ENTRIES, HERBS, HINTS, INTRO_SCRIPT, HERB_BOOK_LORE_DAY1, HERB_BOOK_LORE_DAY2, HERB_BOOK_LORE_DAY3,SCRIPTS, RESULT_TITLES, ENDING_SCRIPTS, ENDING_TITLES } from '../constants';

interface Props {
  gameState: GameState;
  activeNode: ScriptNode | null;
  onNext: () => void;
  onChoice: (nextId: string) => void;
  onBrew: () => void;
  onClear: () => void;
  onStart: () => void;
  onCloseResult: () => void;
  onStartTrueEnding: () => void; 
  onCompleteEnding: () => void;
  onRestart: () => void;
  onWakeUp: () => void; // New prop for manually ending transition
}

const SafeImage = ({ src, alt, className, ...props }: any) => {
  const [imgSrc, setImgSrc] = useState(src);
  useEffect(() => setImgSrc(src), [src]);
  return (
    <img 
      {...props}
      src={imgSrc} 
      alt={alt}
      className={className}
      onError={() => setImgSrc(`https://placehold.co/400x400/2e7d32/ffffff/png?text=${encodeURIComponent(alt || 'Herb')}`)}
    />
  );
};

export const Interface: React.FC<Props> = ({ gameState, activeNode, onNext, onChoice, onBrew, onClear, onStart, onCloseResult, onStartTrueEnding, onCompleteEnding, onRestart, onWakeUp }) => {
  const [showJournal, setShowJournal] = useState(false);
  const [showHerbs, setShowHerbs] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [hasOpenedHerbs, setHasOpenedHerbs] = useState(false);
  const [viewedJournalLength, setViewedJournalLength] = useState(0);
  const [isIntroExiting, setIsIntroExiting] = useState(false);
  
  // Ending Page State
  const [endingPage, setEndingPage] = useState(0);

  const [displayedText, setDisplayedText] = useState('');
  const typingTimeoutRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Determine if it's Ending 3 and if we should show the white background (Page Index >= 2)
  const isEnding3 = gameState.endingScript === ENDING_SCRIPTS.ending3;
  const showWhiteBackground = isEnding3 && endingPage >= 2;

  useEffect(() => {
    if (activeNode) {
      // Clear any existing interval to prevent overlap/glitches
      if (typingTimeoutRef.current) {
        clearInterval(typingTimeoutRef.current);
      }

      setDisplayedText('');
      let i = 0;
      
      typingTimeoutRef.current = setInterval(() => {
        i++;
        setDisplayedText(activeNode.text.substring(0, i));
        
        if (i >= activeNode.text.length) {
          if (typingTimeoutRef.current) {
             clearInterval(typingTimeoutRef.current);
             typingTimeoutRef.current = null;
          }
        }
      }, 20); 

      return () => {
        if (typingTimeoutRef.current) clearInterval(typingTimeoutRef.current);
      };
    }
  }, [activeNode]);

  useEffect(() => {
    setHasOpenedHerbs(false);
  }, [gameState.day]);
  
  // Reset Ending Page when entering ENDING phase
  useEffect(() => {
      if (gameState.phase === 'ENDING') {
          setEndingPage(0);
      }
  }, [gameState.phase]);

  // Precise Ending Page Timer
  useEffect(() => {
    if (gameState.phase === 'ENDING') {
      const currentScriptPage = gameState.endingScript[endingPage];
      if (!currentScriptPage) return;

      const isFirstPage = endingPage === 0;
      const exitBuffer = isFirstPage ? 0 : 1000; 
      const animationTime = currentScriptPage.length * 2000; 
      const holdTime = 2000;

      const totalTime = exitBuffer + animationTime + holdTime;

      // Logic to stop or transition
      if (endingPage < gameState.endingScript.length - 1) {
          const timer = setTimeout(() => {
              setEndingPage(prev => prev + 1);
          }, totalTime);
          return () => clearTimeout(timer);
      } else {
          // Last page reached. 
          const timer = setTimeout(() => {
             // If this is Ending 3, trigger the True Ending Sequence
             if (gameState.endingScript === ENDING_SCRIPTS.ending3) {
                  onStartTrueEnding();
             } else {
                 // For Endings 1, 2, 4 -> Show the Return UI
                 onCompleteEnding();
             }
          }, totalTime);
          return () => clearTimeout(timer);
      }
    }
  }, [endingPage, gameState.phase, gameState.endingScript, onStartTrueEnding, onCompleteEnding]);


  const handleDialogClick = () => {
    // Case 1: Text is still typing -> Stop timer and show full text immediately
    if (activeNode && displayedText !== activeNode.text) {
      if (typingTimeoutRef.current) {
        clearInterval(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      setDisplayedText(activeNode.text);
    } 
    // Case 2: Text is fully displayed -> Proceed to next node
    else if (activeNode && (!activeNode.choices || activeNode.choices.length === 0)) {
      onNext();
    }
  };

  const handleOpenHerbs = () => {
      setShowHerbs(true);
      setHasOpenedHerbs(true);
  };

  const handleOpenJournal = () => {
      setShowJournal(true);
      setViewedJournalLength(gameState.unlockedJournal.length);
  };
  
  const handleIntroStart = () => {
      setIsIntroExiting(true);
      // Wait for the fade out animation (2s) to finish before actually changing phase
      setTimeout(() => {
          onStart();
      }, 1200);
  };

  const isSystemOrGod = (speaker: string) => {
      return speaker === '系統' || speaker.includes('夢境中神') || speaker === '低語';
  };

  const shouldShowHints = !activeNode && gameState.phase !== 'INTRO' && gameState.phase !== 'ENDING' && gameState.phase !== 'START_SCREEN' && gameState.phase !== 'TRUE_ENDING_SEQUENCE';
  const hintText = gameState.activeHint || HINTS[gameState.day];

  // If on Start Screen, show nothing
  if (gameState.phase === 'START_SCREEN') return null;

  return (
    <>
      {/* Black Screen Transition Overlay (Day Change) */}
      <AnimatePresence>
        {gameState.isTransitioning && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0 bg-black z-[200] flex flex-col items-center justify-center select-none"
            >
                {gameState.day <= 4 && (
                    <>
                        <motion.h2 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1, duration: 2 }}
                            className="text-[#d4af37] font-title text-5xl md:text-7xl tracking-[0.2em] uppercase mb-10"
                        >
                            Day <span className="font-serif">{gameState.day}</span>
                        </motion.h2>

                        <motion.button
                           variants={{
                             hidden: { opacity: 0, pointerEvents: 'none' },
                             visible: { 
                               opacity: 1, 
                               pointerEvents: 'auto',
                               transition: { delay: 3.5, duration: 1.5 } 
                             }
                           }}
                           initial="hidden"
                           animate="visible"
                           onClick={onWakeUp}
                           className="px-8 py-3 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 rounded font-serif text-xl tracking-widest uppercase cursor-pointer"
                        >
                           『時候』將近，醒來吧。
                        </motion.button>
                    </>
                )}
            </motion.div>
        )}
      </AnimatePresence>
      
      {/* Final Ending UI (Title & Return Button) */}
      <AnimatePresence>
         {gameState.showEndingUI && gameState.reachedEndingId && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 1.5 }}
               className="absolute inset-0 z-[200] flex flex-col items-center justify-center pointer-events-auto"
            >
                 <h1 className={`text-4xl md:text-6xl font-title tracking-widest mb-12 drop-shadow-2xl ${gameState.reachedEndingId === 'ending3' ? 'text-black border-black' : 'text-[#d4af37] border-[#d4af37]'} border-b-2 pb-4`}>
                    {ENDING_TITLES[gameState.reachedEndingId]}
                 </h1>
                 <button 
                    onClick={onRestart}
                    className={`px-8 py-3 border-2 font-serif text-xl tracking-widest uppercase transition-all duration-300 shadow-xl cursor-pointer
                        ${gameState.reachedEndingId === 'ending3' 
                           ? 'border-black text-black hover:bg-black hover:text-white' 
                           : 'border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0d1b1e]'}
                    `}
                 >
                    Return to Title
                 </button>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Pending Result Notification Modal (Morning Report) */}
      <AnimatePresence>
        {gameState.pendingResult && !gameState.isTransitioning && (
            <div className="absolute inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="bg-[#1a2f33] border-2 border-[#d4af37] rounded-lg p-8 max-w-2xl w-full shadow-[0_0_30px_rgba(212,175,55,0.3)] relative text-center"
                >
                    <h3 className="text-[#d4af37] font-title text-3xl mb-6 tracking-widest border-b border-[#d4af37]/30 pb-4">
                        {RESULT_TITLES[gameState.pendingResult] || "昨日的後續"}
                    </h3>
                    
                    <div className="text-xl md:text-2xl text-[#e2d2a4] font-serif leading-relaxed whitespace-pre-line mb-8 text-left">
                         {SCRIPTS[gameState.pendingResult]?.map((node, i) => (
                             <p key={i} className="mb-4">{node.text}</p>
                         ))}
                    </div>

                    <button 
                        onClick={onCloseResult}
                        className="px-8 py-3 bg-[#d4af37] text-[#002630] font-bold font-title text-xl rounded hover:bg-[#f9e79f] transition-colors shadow-lg"
                    >
                        事件結束
                    </button>
                </motion.div>
            </div>
        )}
      </AnimatePresence>


      {/* Ghostly Inner Voice / Hints (Top Overlay) */}
      {hintText && shouldShowHints && !gameState.pendingResult && (
        <div className="absolute top-4 left-0 right-0 z-[50] flex justify-center pointer-events-none">
          <p className="text-[#d4af37] italic font-serif text-lg md:text-xl max-w-xl text-center px-6 py-2 drop-shadow-[0_0_8px_rgba(212,175,55,0.8)] animate-pulse whitespace-pre-line">
            {hintText}
          </p>
        </div>
      )}

      {/* Top Right HUD */}
      {gameState.phase !== 'INTRO' && gameState.phase !== 'ENDING' && gameState.phase !== 'TRUE_ENDING_SEQUENCE' && !gameState.isTransitioning && gameState.day <= 3 && (
      <div className="absolute top-4 right-4 z-[60] flex flex-col items-end gap-3">
        {/* Day Indicator */}
        {gameState.day > 0 && (
            <h2 className="text-[#d4af37] font-title text-2xl md:text-3xl tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mr-1 pointer-events-none select-none">
              Day <span className="font-serif">{gameState.day}</span>
            </h2>
        )}

        <div className="flex gap-4">
          <button onClick={() => setShowLogs(true)} className="p-2 bg-[#003d4c] border border-[#d4af37] rounded-full hover:bg-[#00566b] text-[#d4af37] cursor-pointer" title="對話紀錄">
             <History size={24} />
          </button>
          <button onClick={handleOpenJournal} className="p-2 bg-[#003d4c] border border-[#d4af37] rounded-full hover:bg-[#00566b] text-[#d4af37] relative cursor-pointer" title="日記">
             <Book size={24} />
             {gameState.unlockedJournal.length > viewedJournalLength && shouldShowHints && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>}
          </button>
          <div className="relative">
            <button onClick={handleOpenHerbs} className="p-2 bg-[#003d4c] border border-[#d4af37] rounded-full hover:bg-[#00566b] text-[#d4af37] relative cursor-pointer" title="藥草誌">
               <Scroll size={24} />
               {shouldShowHints && !hasOpenedHerbs && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>}
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Intro Overlay */}
      {gameState.phase === 'INTRO' && (
          <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: isIntroExiting ? 0 : 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-black z-[100] flex flex-col justify-center items-center text-[#e2d2a4] font-serif p-10 text-center select-none"
          >
             <motion.div 
               initial="hidden"
               animate="visible"
               variants={{
                 visible: { transition: { staggerChildren: 1.5 } }
               }}
               className="max-w-2xl text-2xl leading-relaxed"
             >
                {INTRO_SCRIPT.map((line, i) => (
                   <motion.p 
                     key={i} 
                     variants={{
                       hidden: { opacity: 0, y: 10 },
                       visible: { opacity: 1, y: 0, transition: { duration: 1.5 } }
                     }}
                     className={i === INTRO_SCRIPT.length - 1 ? "mt-6 text-3xl" : "mb-3"}
                   >
                     {line}
                   </motion.p>
                ))}
             </motion.div>
             
             <motion.button
               variants={{
                 hidden: { opacity: 0, pointerEvents: 'none' },
                 visible: { 
                   opacity: 1, 
                   pointerEvents: 'auto',
                   transition: { delay: INTRO_SCRIPT.length * 1.5, duration: 1.5 } 
                 }
               }}
               initial="hidden"
               animate="visible"
               onClick={handleIntroStart}
               className="mt-12 px-8 py-3 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 rounded font-serif text-xl tracking-widest uppercase cursor-pointer"
             >
               『時候』將近，醒來吧。
             </motion.button>
          </motion.div>
      )}

      {/* Ending Overlay */}
      {gameState.phase === 'ENDING' && (
          <div className="absolute inset-0 bg-black z-[100] flex flex-col justify-center items-center font-serif p-10 text-center select-none overflow-hidden">
             {/* White Background Transition for Ending 3 */}
             {isEnding3 && (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showWhiteBackground ? 1 : 0 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0 bg-white z-0"
                 />
             )}

             <AnimatePresence mode="wait">
                 {!gameState.showEndingUI && (
                 <motion.div 
                   key={endingPage} // Changing key triggers re-render and animation
                   initial="hidden"
                   animate="visible"
                   exit="exit"
                   variants={{
                     hidden: { opacity: 0 },
                     visible: { 
                         opacity: 1,
                         transition: { staggerChildren: 2 } 
                     },
                     exit: { opacity: 0, transition: { duration: 1 } }
                   }}
                   // Text color switch: Gold normally, but Black if it is Ending 3 and on the white pages
                   className={`max-w-3xl text-3xl leading-relaxed relative z-10 ${showWhiteBackground ? 'text-black' : 'text-[#e2d2a4]'}`}
                 >
                    {gameState.endingScript[endingPage]?.map((line, i) => (
                       <motion.p 
                         key={i} 
                         variants={{
                           hidden: { opacity: 0, y: 20 },
                           visible: { opacity: 1, y: 0, transition: { duration: 2 } }
                         }}
                         className="mb-6"
                       >
                         {line}
                       </motion.p>
                    ))}
                 </motion.div>
                 )}
             </AnimatePresence>
          </div>
      )}
      
      {/* TRUE ENDING SEQUENCE */}
      {gameState.phase === 'TRUE_ENDING_SEQUENCE' && (
            // Solid white background, continuing from the end of Ending 3
            <div className="absolute inset-0 bg-white z-[48]" />
      )}

      {/* Dialog Box (Standard) */}
      {activeNode && gameState.phase !== 'BREWING' && gameState.phase !== 'INTRO' && gameState.phase !== 'ENDING' && !gameState.pendingResult && !gameState.isTransitioning && !gameState.showEndingUI && (
        <div className="absolute bottom-4 left-4 right-4 md:left-20 md:right-20 h-64 md:h-72 bg-[#002630]/95 border border-[#d4af37] rounded-lg shadow-2xl z-[50] p-8 flex flex-col cursor-pointer"
             onClick={handleDialogClick}
        >
          {/* Speaker Header - Fixed at top */}
          {!isSystemOrGod(activeNode.speaker) && (
              <div className="shrink-0 mb-2">
                  <h3 className="text-[#d4af37] font-bold text-2xl md:text-3xl font-title uppercase tracking-widest border-b border-[#d4af37]/30 pb-1 inline-block">
                      {activeNode.speaker}
                  </h3>
              </div>
          )}

          {/* Text Area - Vertically Centered */}
          <div className="flex-1 flex flex-col justify-center min-h-0">
              <p className="text-2xl md:text-3xl leading-loose font-serif text-white/90 whitespace-pre-line">
                  {displayedText}
                  {displayedText === activeNode.text && !activeNode.choices && <span className="animate-pulse ml-2 text-[#d4af37]">▼</span>}
              </p>
          </div>

          {/* Choices - Integrated into Dialogue Box */}
          {activeNode.choices && displayedText === activeNode.text && (
            <div className="flex flex-wrap gap-4 mt-2 justify-end shrink-0">
                {activeNode.choices.map((choice, idx) => (
                    <button 
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); onChoice(choice.next); }}
                        className="px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8952b] text-[#002630] font-bold text-xl md:text-2xl rounded hover:brightness-110 transition-all shadow-lg font-title border border-[#f9e79f]/50 cursor-pointer"
                    >
                        {choice.text}
                    </button>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Brewing UI Buttons - Centered */}
      {gameState.phase === 'BREWING' && (
          <div className="absolute bottom-20 right-10 z-50 flex gap-4">
              <button onClick={onClear} className="px-6 py-3 bg-red-900/80 border border-red-500 text-white rounded font-title text-lg hover:bg-red-800 cursor-pointer">
                  清空大釜
              </button>
              <button 
                onClick={onBrew} 
                disabled={gameState.potionsBrewed.length === 0}
                className="px-6 py-3 bg-[#d4af37] border border-white text-[#002630] rounded font-title font-bold text-lg hover:bg-[#f9e79f] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(212,175,55,0.6)] animate-pulse cursor-pointer"
              >
                  調製
              </button>
          </div>
      )}

      {/* Modals */}
      
      {/* Journal */}
      {showJournal && (
          <div className="absolute inset-0 bg-black/80 z-[60] flex justify-center items-center">
              <div className="bg-[#f5e6c8] text-[#3e2723] w-full max-w-2xl h-[80vh] p-8 rounded shadow-2xl overflow-y-auto relative font-serif">
                  <button onClick={() => setShowJournal(false)} className="absolute top-4 right-4 cursor-pointer"><X /></button>
                  <h2 className="text-4xl font-title text-center mb-8 border-b-2 border-[#3e2723] pb-2">日記</h2>
                  <div className="space-y-6 text-xl md:text-2xl">
                      {gameState.unlockedJournal.map(idx => {
      console.log("渲染日記 index:", idx, "內容:", JOURNAL_ENTRIES[idx]);
      return (
          <div key={idx} className="mb-4">
              <p className="whitespace-pre-line">{JOURNAL_ENTRIES[idx]}</p>
              <div className="flex justify-center mt-2 text-2xl text-[#3e2723]/50">***</div>
          </div>
      );
  })}
                  </div>
              </div>
          </div>
      )}

      {/* Herb Book */}
      {showHerbs && (
          <div className="absolute inset-0 bg-black/80 z-[60] flex justify-center items-center">
              <div className="bg-[#1a2f33] text-[#e2d2a4] w-full max-w-3xl h-[80vh] p-8 rounded border-2 border-[#d4af37] shadow-2xl overflow-y-auto relative custom-scrollbar">
                  <button onClick={() => setShowHerbs(false)} className="absolute top-4 right-4 cursor-pointer"><X /></button>
                  <h2 className="text-4xl font-title text-center mb-8 text-[#d4af37]">藥草誌</h2>
                  
                  <p className="mb-8 text-center italic text-[#d4af37]/80 leading-relaxed px-8 whitespace-pre-line text-xl md:text-2xl">
                      {HERB_BOOK_LORE_DAY1}
                      {gameState.day >= 2 && (
                          <>
                            <br /><br />
                            {HERB_BOOK_LORE_DAY2}
                          </>
                      )}
                      {gameState.day >= 3 && (
                          <>
                            <br /><br />
                            {HERB_BOOK_LORE_DAY3}
                          </>
                      )}
                  </p>
                  
                    {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {HERBS.map(herb => (
                            <div key={herb.id} className="flex gap-4 items-start border border-[#d4af37]/20 p-4 rounded bg-[#0d1b1e]/50 hover:bg-[#0d1b1e] transition-colors">
                                <SafeImage src={herb.image} className="w-20 h-20 object-contain shrink-0" alt={herb.name} fallbackColor="2e7d32" />
                                <div>
                                    <h3 className="text-[#d4af37] font-bold text-xl mb-1">{herb.name}</h3>
                                    <p className="text-lg text-gray-300 leading-snug">{herb.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>*/}
              </div>
          </div>
      )}

      {/* Logs */}
      {showLogs && (
          <div className="absolute inset-0 bg-black/80 z-[60] flex justify-center items-center">
              <div className="bg-[#002630] text-[#e2d2a4] w-full max-w-2xl h-[70vh] p-8 rounded border border-[#d4af37] relative flex flex-col">
                   <button onClick={() => setShowLogs(false)} className="absolute top-4 right-4 cursor-pointer"><X /></button>
                   <h2 className="text-3xl font-title mb-6 text-[#d4af37]">對話紀錄</h2>
                   <div className="overflow-y-auto flex-1 space-y-4 pr-2 custom-scrollbar">
                       {gameState.logs.map((log, i) => (
                           <div key={i} className="border-b border-[#d4af37]/20 pb-2">
                               <span className="font-bold text-[#d4af37] text-lg md:text-xl uppercase block mb-1">{log.speaker}</span>
                               <p className="text-xl md:text-2xl opacity-90 whitespace-pre-line">{log.text}</p>
                           </div>
                       ))}
                   </div>
              </div>
          </div>
      )}
    </>
  );
};