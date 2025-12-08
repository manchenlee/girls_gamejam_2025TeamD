
import React, { useRef, useState, useEffect } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { GameScene } from './components/GameScene';
import { HomeScene } from './components/HomeScene';
import { Interface } from './components/Interface';
import { HerbId } from './types';
import { ASSETS } from './constants';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const { state, activeScriptNode, actions } = useGameLogic();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [musicStarted, setMusicStarted] = useState(false);

  // [NEW] 處理 Quote 點擊，開始音樂並進入標題畫面
  const handleQuoteClick = async () => {
    // 1. 音樂播放邏輯
    if (audioRef.current && !musicStarted) {
      try {
        audioRef.current.volume = 0.4;
        await audioRef.current.play();
        setMusicStarted(true);
      } catch (e) {
        console.error("Audio Playback Failed:", e);
      }
    }
    // 2. 進入標題畫面
    actions.dismissQuote();
  };

  // [NEW] 處理開始遊戲
  const handleStartGame = () => {
    actions.startGame();
  };

  // 在 App.tsx 中
useEffect(() => {
  if (!audioRef.current) return;

  // 1. 決定要播哪一首
  let targetBgm = ASSETS.bgm1;
  
  // Day 4 的音樂邏輯 (維持您之前的設定)
  if ((state.day === 4 && activeScriptNode?.id.startsWith('d4') && !state.pendingResult) || (state.day === 4 && state.phase === 'BREWING')) {
    targetBgm = ASSETS.bgm2;
  }
  
  // 一般結局音樂
  if (state.phase === 'ENDING') {
    targetBgm = ASSETS.bgm3;
  }

  // --- 新增：結局 3 專用音樂邏輯 (覆蓋上面的設定) ---
  // 條件 1: 在 ENDING 階段且是結局 3
  // 條件 2: 進入後續的 TRUE_ENDING_SEQUENCE 階段
  if ((state.phase === 'ENDING' && state.reachedEndingId === 'ending3') || 
       state.phase === 'TRUE_ENDING_SEQUENCE') {
    targetBgm = ASSETS.bgm4;
  }

  // 2. 檢查是否需要切換 (比對 src 字串)
  // 注意：audio.src 通常會包含完整網域，所以用 includes 比較保險
  if (!audioRef.current.src.includes(targetBgm)) {
    audioRef.current.src = targetBgm;
    audioRef.current.play().catch(e => console.log("切換音樂失敗", e));
  }

}, [state.day, state.phase, activeScriptNode, state.pendingResult, state.reachedEndingId]); // 監聽天數與階段變化

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: HerbId) => {
    e.dataTransfer.setData('herbId', id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const herbId = e.dataTransfer.getData('herbId') as HerbId;
    if (herbId) {
      actions.addToPot(herbId);
    }
  };

  // Click Handlers for Accessibility / Mobile
  const [selectedHerb, setSelectedHerb] = React.useState<HerbId | null>(null);

  const handleHerbClick = (id: HerbId) => {
    if (state.phase === 'BREWING') {
      setSelectedHerb(id);
    }
  };

  const handlePotClick = () => {
    if (state.phase === 'BREWING' && selectedHerb) {
      actions.addToPot(selectedHerb);
      setSelectedHerb(null);
    }
  };

  const isKnocking = activeScriptNode?.id === 'd1_3' || activeScriptNode?.id === 'd2_4' || activeScriptNode?.id === 'd4_4';

  return (
    <div className="w-screen h-screen relative bg-black overflow-hidden">
      {/* Background Music - 確保這一行始終被渲染，ref 才能抓到元素 */}
      <audio ref={audioRef} src={ASSETS.bgm1} loop />

      {state.phase === 'QUOTE_SCREEN' ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full flex flex-col items-center justify-center bg-black cursor-pointer p-10 select-none"
            onClick={handleQuoteClick}
          >
             <div className="max-w-3xl text-center">
                 <p className="text-[#e2d2a4] font-serif text-2xl md:text-3xl italic leading-relaxed mb-8">
                    “I am no bird; and no net ensnares me:<br/>I am a free human being with an independent will.”
                 </p>
                 <p className="text-[#d4af37] font-title text-xl tracking-widest uppercase opacity-80">
                    — Charlotte Brontë, Jane Eyre
                 </p>
             </div>
             <p className="absolute bottom-10 text-[#d4af37]/30 text-sm animate-pulse">Click to enter</p>
          </motion.div>
      ) : state.phase === 'START_SCREEN' ? (
         <HomeScene 
            onStart={handleStartGame} 
            onDebugEnding3={actions.debugTriggerEnding3}
         />
      ) : (
        <>
          {/* Scene Layer */}
          <GameScene 
            gameState={state} 
            //activeScriptNode={activeScriptNode} 
            onHerbDragStart={handleDragStart}
            onPotDrop={handleDrop}
            onPotClick={handlePotClick}
            onHerbClick={handleHerbClick}
            isShaking={isKnocking}
          />

          {/* Interface Layer (HUD, Dialogs) */}
          <Interface 
            gameState={state}
            activeNode={activeScriptNode}
            onNext={actions.advanceDialogue}
            onChoice={actions.handleChoice}
            onBrew={actions.brew}
            onClear={actions.clearPot}
            // 修正：傳遞天數參數以正確推進遊戲
            onStart={() => actions.startDay(1)}
            onCloseResult={actions.closeResultModal}
            onStartTrueEnding={actions.triggerTrueEndingSequence}
            onCompleteEnding={actions.completeEndingSequence}
            onRestart={actions.restartGame}
            onWakeUp={actions.wakeUp}
            onAdvanceTutorial={actions.advanceTutorial}
          />

          {/* Mobile Selection Indicator */}
          {selectedHerb && state.phase === 'BREWING' && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[100] text-[#d4af37] font-bold text-2xl drop-shadow-md animate-bounce">
               
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;