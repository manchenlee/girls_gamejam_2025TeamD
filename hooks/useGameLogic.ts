import { useState, useEffect, useCallback } from 'react';
import { GameState, GamePhase, CharacterId, HerbId, ScriptNode, LogEntry } from '../types';
import { INTRO_SCRIPT, SCRIPTS, HERBS, DAY2_HINT_HEAL, DAY2_HINT_POISON, DAY1_HINT_LOVE, DAY1_HINT_FAIL, DAY3_HINT_FAKE, DAY3_HINT_POISON, DAY4_HINT, DAY4_HINT_ED3, DAY4_HINT_ED3NOT, ENDING_SCRIPTS, TRUE_ENDING_SCRIPT } from '../constants';

const INITIAL_STATE: GameState = {
  day: 0,
  phase: GamePhase.START_SCREEN, // Updated Initial Phase
  currentGuest: null,
  potionsBrewed: [],
  history: {
    day1Result: null,
    day2Result: null,
    day3Result: null,
    savedGirlPreviously: false,
  },
  dialogueIndex: 0,
  logs: [],
  unlockedJournal: [], 
  unlockedRecipes: [],
  whisperActive: false,
  sceneItems: [],
  activeHint: null,
  pendingResult: null,
  nextDayResult: null,
  isTransitioning: false,
  isBlackout: false,
  endingScript: [],
  reachedEndingId: null,
  showEndingUI: false,
};

export const useGameLogic = () => {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [currentScript, setCurrentScript] = useState<string[]>(INTRO_SCRIPT);
  const [activeScriptNode, setActiveScriptNode] = useState<ScriptNode | null>(null);

  // Monitor Script Node for Side Effects (Visuals)
  useEffect(() => {
    if (!activeScriptNode) return;
    
    // Day 4: Kidnapping Scene Blackout
    if (activeScriptNode.id === 'd4_4') {
        setState(prev => ({ ...prev, isBlackout: true }));
    }
    // Day 4: Return to room
    if (activeScriptNode.id === 'd4_8') {
        setState(prev => ({ ...prev, isBlackout: false }));
    }

  }, [activeScriptNode]);

  const addLog = (speaker: string, text: string) => {
    setState(prev => ({
      ...prev,
      logs: [...prev.logs, { speaker, text }]
    }));
  };

  const startGame = () => {
      setState(prev => ({ ...prev, phase: GamePhase.INTRO }));
  };

  const restartGame = () => {
      setState(INITIAL_STATE);
      setActiveScriptNode(null);
  };
  
  // Debug: Directly jump to Ending 3
  const debugTriggerEnding3 = () => {
       setState(prev => ({ 
             ...prev, 
             phase: GamePhase.ENDING,
             potionsBrewed: [],
             endingScript: ENDING_SCRIPTS.ending3,
             reachedEndingId: 'ending3'
        }));
  };

  const startDay = (day: number) => {
    // If we are just starting Day 4 to show results, handling is slightly different
    // but the generic logic of popping nextDayResult -> pendingResult applies.
    
    let scriptKey = `day${day}_start`;
    let guest = null;
    let phase = GamePhase.MORNING;

    const script = SCRIPTS[scriptKey];
    if(script) {
        setActiveScriptNode(script[0]);
    } else {
        setActiveScriptNode(null);
    }

    let newSceneItems = [...state.sceneItems];
    if (day === 2) {
       if (state.history.day1Result === 'cured') {
           newSceneItems.push('feather');
       } else if (state.history.day1Result === 'fail' || state.history.day1Result === null) {
           newSceneItems.push('dagger');
       }
    }else if (day === 3) {
        if (state.history.day2Result === 'heal') {
            console.log("掃帚新增");
           newSceneItems.push('broom');
    } }
    else if (day === 4) {
        //newSceneItems.push('broom');
        newSceneItems.push('book');
    }
    
    setState(prev => ({
      ...prev,
      day,
      phase,
      currentGuest: guest,
      dialogueIndex: 0,
      potionsBrewed: [],
      unlockedJournal: day <= 3 ? [...prev.unlockedJournal, day - 1] : prev.unlockedJournal,
      sceneItems: newSceneItems,
      activeHint: null, 
      isTransitioning: false, 
      isBlackout: false,
      // CRITICAL: Move the delayed result to pending so it shows now
      pendingResult: prev.nextDayResult,
      nextDayResult: null,
    }));
  };

  const advanceDialogue = () => {
    if (!activeScriptNode) return;
    addLog(activeScriptNode.speaker, activeScriptNode.text);

    if (activeScriptNode.choices && activeScriptNode.choices.length > 0) {
      return; 
    }
    nextNodeInSequence();
  };
  
  const triggerTrueEndingSequence = () => {
      setState(prev => ({ ...prev, phase: GamePhase.TRUE_ENDING_SEQUENCE }));
      setActiveScriptNode(TRUE_ENDING_SCRIPT[0]);
  };
  
  const completeEndingSequence = () => {
      setState(prev => ({ ...prev, showEndingUI: true }));
  };

  const handleChoice = (nextScriptId: string) => {
    // True Ending Final Transition (Fix for hanging on last choice)
    if (nextScriptId === 'te_final') {
        setState(prev => ({ ...prev, showEndingUI: true }));
        return;
    }

    // Day 1: Love Path
    if (nextScriptId === 'd1_brew_love') {
        setState(prev => ({ 
            ...prev, 
            phase: GamePhase.BREWING,
            activeHint: DAY1_HINT_LOVE
        }));
        setActiveScriptNode(null);
        return;
    }
    // Day 1: Fail/Punish Path
    if (nextScriptId === 'd1_brew_fail') {
        setState(prev => ({ 
            ...prev, 
            phase: GamePhase.BREWING,
            activeHint: DAY1_HINT_FAIL
        }));
        setActiveScriptNode(null);
        return;
    }

    if (nextScriptId.includes('brew') && !nextScriptId.includes('prompt')) {
      setState(prev => ({ ...prev, phase: GamePhase.BREWING }));
      setActiveScriptNode(null);
    } else {
       // Check standard scripts
       let found: ScriptNode | undefined;
       Object.values(SCRIPTS).forEach(arr => {
         const node = arr.find(n => n.id === nextScriptId);
         if (node) found = node;
       });
       
       // Check True Ending Script
       if (!found) {
           found = TRUE_ENDING_SCRIPT.find(n => n.id === nextScriptId);
       }

       if (found) setActiveScriptNode(found);
       else nextNodeInSequence(); 
    }
  };

  const nextNodeInSequence = () => {
      if(!activeScriptNode) return;
      
      const currentId = activeScriptNode.id;
      
      // True Ending Sequence Final Transition
      if (currentId === 'te_final') {
          setState(prev => ({ ...prev, showEndingUI: true })); 
          return;
      }
      
      // Day 2 Heal Path Brewing Trigger (Specific Logic)
      if (currentId === 'd2_bhp_1') {
          setState(prev => ({ 
              ...prev, 
              phase: GamePhase.BREWING,
              activeHint: DAY2_HINT_HEAL
          }));
          setActiveScriptNode(null);
          return;
      }
      
      // Day 2 Poison Path Brewing Trigger (Specific Logic)
      if (currentId === 'd2_bpp_1') {
          setState(prev => ({ 
              ...prev, 
              phase: GamePhase.BREWING,
              activeHint: DAY2_HINT_POISON
          }));
          setActiveScriptNode(null);
          return;
      }

      // Day 3 Fake Death Path Brewing Trigger
      if (currentId === 'd3_bfp_1') {
          setState(prev => ({ 
              ...prev, 
              phase: GamePhase.BREWING,
              activeHint: DAY3_HINT_FAKE
          }));
          setActiveScriptNode(null);
          return;
      }

      // Day 3 Poison Path Brewing Trigger
      if (currentId === 'd3_bpp_1') {
          setState(prev => ({ 
              ...prev, 
              phase: GamePhase.BREWING,
              activeHint: DAY3_HINT_POISON
          }));
          setActiveScriptNode(null);
          return;
      }

      // Day 4 Brewing Trigger
      if (currentId === 'd4_brew_prompt_1') {
          const hasFeather = state.sceneItems.includes('feather');
          const hasBroom = state.sceneItems.includes('broom');
          const hasDagger = state.sceneItems.includes('dagger');
          
          const hint = (hasBroom && hasDagger || hasBroom && hasFeather) ? DAY4_HINT_ED3 : DAY4_HINT_ED3NOT;

          setState(prev => ({ 
              ...prev, 
              phase: GamePhase.BREWING,
              activeHint: hint
          }));
          setActiveScriptNode(null);
          return;
      }
      
      // Identify current script block
      let currentScriptBlock: ScriptNode[] = [];
      
      // Check if it is the True Ending Script
      if (TRUE_ENDING_SCRIPT.find(n => n.id === currentId)) {
          currentScriptBlock = TRUE_ENDING_SCRIPT;
      } else {
          Object.entries(SCRIPTS).forEach(([key, nodes]) => {
              if (nodes.find(n => n.id === currentId)) {
                  currentScriptBlock = nodes;
              }
          });
      }
      
      const currentIndex = currentScriptBlock.findIndex(n => n.id === currentId);
      
      // Check if there is a next node in the array
      if (currentIndex !== -1 && currentIndex < currentScriptBlock.length - 1) {
          setActiveScriptNode(currentScriptBlock[currentIndex + 1]);
      } else {
          // --- END OF SCRIPT BLOCK REACHED ---
          
          // Generic Logic: If Morning script ends, transition to Guest
          if (state.phase === GamePhase.MORNING) {
              
              let nextGuest = CharacterId.GUEST_1;
              if (state.day === 2) nextGuest = CharacterId.GUEST_2;
              if (state.day === 3) nextGuest = CharacterId.GUEST_3;

              setState(prev => ({ 
                  ...prev, 
                  phase: GamePhase.DIALOGUE,
                  currentGuest: nextGuest
              }));
              
              // Load the guest script dynamically based on day
              const guestScriptKey = `day${state.day}_guest`;
              const guestScript = SCRIPTS[guestScriptKey];
              if (guestScript) {
                  setActiveScriptNode(guestScript[0]);
              }
          }
          // Generic Logic: If Result script ends, End the Day
          else if (state.phase === GamePhase.RESULT) {
              endDay();
          }
      }
  };
  
  const endDay = () => {
      setState(prev => ({ ...prev, currentGuest: null, isTransitioning: true }));
      
      // Allow transition up to Day 4 (which triggers Day 3 result modal)
      if (state.day < 4) {
          setTimeout(() => {
              const nextDay = state.day + 1;
              startDay(nextDay);
              
              // Keep overlay up for another 2 seconds then fade out
              setTimeout(() => {
                  setState(prev => ({ ...prev, isTransitioning: false }));
              }, 2000);
              
          }, 2000);
      } else {
          // Fallback if somehow we get past day 4 (shouldn't happen with current logic)
      }
  };

  const addToPot = (item: string) => {
    // STRICT VALIDATION: Special items are ONLY allowed on Day 4 during Brewing phase
    const specialItems = ['cat', 'broom', 'book', 'feather', 'dagger', 'mirror'];
    if (specialItems.includes(item)) {
        if (state.day !== 4 || state.phase !== GamePhase.BREWING) {
            return; // Silently ignore invalid drag attempts
        }
    }

    if (state.potionsBrewed.length < 3) {
        setState(prev => ({
            ...prev,
            potionsBrewed: [...prev.potionsBrewed, item]
        }));
    }
  };
  
  const clearPot = () => {
      setState(prev => ({ ...prev, potionsBrewed: [] }));
  };
  
  const closeResultModal = () => {
      // If we are closing the modal on "Day 4" (which was just for Day 3 result), go to ending
      // BUT now Day 4 is playable, so we just proceed as normal day
      setState(prev => ({ ...prev, pendingResult: null }));
  };

  const brew = () => {
    const ingredients = state.potionsBrewed;
    let delayedResultKey = '';
    let immediateScriptKey = '';
    
    if (state.day === 1) {
        if (ingredients.includes(HerbId.ALOE)) {
             setState(prev => ({ ...prev, history: { ...prev.history, day1Result: 'poisoned' } })); 
             delayedResultKey = 'day1_result_bad';
        } else if (ingredients.includes(HerbId.ERYNGIUM) && ingredients.includes(HerbId.CHAMOMILE)) {
            setState(prev => ({ ...prev, history: { ...prev.history, day1Result: 'cured' } })); 
            delayedResultKey = 'day1_result_love';
        } else {
            setState(prev => ({ ...prev, history: { ...prev.history, day1Result: 'fail' } })); 
            delayedResultKey = 'day1_result_fail';
        }
        immediateScriptKey = 'day1_result';
        setState(prev => ({ ...prev, currentGuest: null }));

    } else if (state.day === 2) {
        const hasAloe = ingredients.includes(HerbId.ALOE);
        const hasEryngium = ingredients.includes(HerbId.ERYNGIUM);
        const hasChamomile = ingredients.includes(HerbId.CHAMOMILE);
        const hasAconite = ingredients.includes(HerbId.ACONITE);
        const hasHemlock = ingredients.includes(HerbId.HEMLOCK);
        const hemlockCount = ingredients.filter(i => i === HerbId.HEMLOCK).length;

        if (hasAloe && hasEryngium || hasAloe && hasEryngium && hasChamomile) {
             setState(prev => ({ ...prev, history: { ...prev.history, day2Result: 'heal' } }));
             delayedResultKey = 'day2_result_heal';
        } else if (hasAconite && hasHemlock && hemlockCount >= 2) {
             setState(prev => ({ ...prev, history: { ...prev.history, day2Result: 'poison' } }));
             delayedResultKey = 'day2_result_poison';
        } else if (hasAconite || hasHemlock){
             setState(prev => ({ ...prev, history: { ...prev.history, day2Result: 'fail' } }));
             delayedResultKey = 'day2_result_fail';
        }
        else{
            setState(prev => ({ ...prev, history: { ...prev.history, day2Result: 'heal_fail' } }));
             delayedResultKey = 'day2_result_heal_fail';
        }
        immediateScriptKey = 'day2_result';
        
    } else if (state.day === 3) {
        // Strict logic for Day 3
        const aconiteCount = ingredients.filter(i => i === HerbId.ACONITE).length;
        const hemlockCount = ingredients.filter(i => i === HerbId.HEMLOCK).length;
        // Count non-target herbs/items
        const othersCount = ingredients.length - aconiteCount - hemlockCount;

        if (aconiteCount === 1 && hemlockCount === 1 && othersCount === 0) {
             // Fake Death (Freedom)
             setState(prev => ({ ...prev, history: { ...prev.history, day3Result: 'freedom', savedGirlPreviously: true } }));
             delayedResultKey = 'day3_result_fake';
        } else if (aconiteCount >= 1 && hemlockCount >= 2 && othersCount === 0) {
             // True Death
             setState(prev => ({ ...prev, history: { ...prev.history, day3Result: 'death' } }));
             delayedResultKey = 'day3_result_death';
        } else {
             // Failure
             setState(prev => ({ ...prev, history: { ...prev.history, day3Result: 'marriage' } }));
             delayedResultKey = 'day3_result_fail';
        }
        immediateScriptKey = 'day3_brew_complete';
    } else if (state.day === 4) {
        // Day 4 Ending Logic (Priority Order)
        let selectedEndingScript = ENDING_SCRIPTS.ending1; // Default: Ending 1 (Poison/Bad)
        let endingId = 'ending1';

        const hasCat = ingredients.includes('cat');
        const hasFeather = ingredients.includes('feather');
        const hasBroom = ingredients.includes('broom');
        const hasDagger = ingredients.includes('dagger');

        if (hasCat) {
             selectedEndingScript = ENDING_SCRIPTS.ending4; // Hidden Ending
             endingId = 'ending4';
        } else if (hasFeather && hasBroom) {
             selectedEndingScript = ENDING_SCRIPTS.ending3; // True Ending
             endingId = 'ending3';
        } else if (hasBroom && hasDagger) {
             selectedEndingScript = ENDING_SCRIPTS.ending3; // True Ending
             endingId = 'ending3';
        } else if (state.history.day3Result === 'freedom') {
             selectedEndingScript = ENDING_SCRIPTS.ending2; // Escape Ending
             endingId = 'ending2';
        } else {
             selectedEndingScript = ENDING_SCRIPTS.ending1; // Default
             endingId = 'ending1';
        }
        
        // Transition directly to Ending Phase (Intro-like black screen)
        setState(prev => ({ 
             ...prev, 
             phase: GamePhase.ENDING,
             potionsBrewed: [],
             unlockedRecipes: [...prev.unlockedRecipes, ingredients.join('+')],
             activeHint: null,
             pendingResult: null,
             nextDayResult: null,
             endingScript: selectedEndingScript,
             reachedEndingId: endingId,
             showEndingUI: false,
        }));
        
        return; 
    }
    
    setState(prev => ({ 
        ...prev, 
        phase: GamePhase.RESULT,
        potionsBrewed: [],
        unlockedRecipes: [...prev.unlockedRecipes, ingredients.join('+')],
        activeHint: null, 
        pendingResult: null, // Clear this, we don't show it now
        nextDayResult: delayedResultKey || null, // Store for tomorrow
    }));
    
    // Play the immediate reaction script
    if (immediateScriptKey) {
        setActiveScriptNode(SCRIPTS[immediateScriptKey][0]);
    }
  };

  return {
    state,
    currentScript,
    activeScriptNode,
    actions: {
        startGame,
        restartGame,
        startDay,
        advanceDialogue,
        handleChoice,
        addToPot,
        clearPot,
        brew,
        addLog,
        closeResultModal,
        triggerTrueEndingSequence,
        completeEndingSequence,
        debugTriggerEnding3
    }
  };
};