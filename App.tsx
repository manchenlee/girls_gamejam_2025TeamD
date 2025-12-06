
import React, { useRef, useState } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { GameScene } from './components/GameScene';
import { HomeScene } from './components/HomeScene';
import { Interface } from './components/Interface';
import { HerbId } from './types';
import { ASSETS } from './constants';

const App: React.FC = () => {
  const { state, activeScriptNode, actions } = useGameLogic();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [musicStarted, setMusicStarted] = useState(false);

  // [NEW] 處理開始遊戲並播放音樂
  const handleStartGame = async () => {
    // 1. 音樂播放邏輯：務必在狀態改變前嘗試播放，以確保在使用者互動的 Context 下執行
    if (audioRef.current && !musicStarted) {
      try {
        audioRef.current.volume = 0.4;
        await audioRef.current.play();
        setMusicStarted(true);
      } catch (e) {
        console.error("Audio Playback Failed:", e);
        // 即使音樂播放失敗（例如被瀏覽器阻擋），也應繼續遊戲
      }
    }
    
    // 2. 開始遊戲（切換畫面）
    actions.startGame();
  };

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

  const isKnocking = activeScriptNode?.id === 'd1_4' || activeScriptNode?.id === 'd2_door' || activeScriptNode?.id === 'd4_4';

  return (
    <div className="w-screen h-screen relative bg-black overflow-hidden">
      {/* Background Music - 確保這一行始終被渲染，ref 才能抓到元素 */}
      <audio ref={audioRef} src={ASSETS.bgm} loop />

      {state.phase === 'START_SCREEN' ? (
         <HomeScene 
            onStart={handleStartGame} 
            onDebugEnding3={actions.debugTriggerEnding3}
         />
      ) : (
        <>
          {/* Scene Layer */}
          <GameScene 
            gameState={state} 
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
