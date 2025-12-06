
export enum GamePhase {
  START_SCREEN = 'START_SCREEN',
  INTRO = 'INTRO',
  MORNING = 'MORNING', // Weather check
  DIALOGUE = 'DIALOGUE',
  BREWING = 'BREWING',
  RESULT = 'RESULT',
  ENDING = 'ENDING',
  TRUE_ENDING_SEQUENCE = 'TRUE_ENDING_SEQUENCE'
}

export enum HerbId {
  CHAMOMILE = 'gr1',
  ACONITE = 'gr2',
  ALOE = 'gr3',
  ERYNGIUM = 'gr4',
  HEMLOCK = 'gr5',
  MANDRAKE = 'gr6',
  VALERIAN = 'gr7',
  SAGE = 'gr8'
}

export enum CharacterId {
  MAIN = 'mainC',
  MAIN_GLITCH = 'mainC2', // Added for glitch effect
  CAT = 'cat_black',
  GUEST_1 = 'c1', // Wife
  GUEST_2 = 'c2', // Boy
  GUEST_3 = 'c3'  // Girl
}

export interface Herb {
  id: HerbId;
  name: string;
  description: string;
  image: string;
}

export interface LogEntry {
  speaker: string;
  text: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface GameState {
  day: number;
  phase: GamePhase;
  currentGuest: CharacterId | null;
  potionsBrewed: string[]; // Changed from HerbId[] to string[] to allow special items
  history: {
    day1Result: 'cured' | 'poisoned' | 'fail' | null;
    day2Result: 'love' | 'diarrhea' | 'fail' | 'heal' | 'poison' | null;
    day3Result: 'freedom' | 'death' | 'marriage' | null;
    savedGirlPreviously: boolean;
  };
  dialogueIndex: number;
  logs: LogEntry[];
  unlockedJournal: number[]; // Array of unlocked paragraph IDs
  unlockedRecipes: string[]; // Array of strings describing mixtures
  whisperActive: boolean; // Is the player interfering?
  sceneItems: string[]; // List of dropped items (ids) in the scene
  activeHint: string | null; // Dynamic hint text for top screen
  pendingResult: string | null; // Key for the result script to be shown via Modal (NOW)
  nextDayResult: string | null; // Key for the result script to be shown TOMORROW
  isTransitioning: boolean; // Controls black screen overlay (Day transition)
  isBlackout: boolean; // Controls narrative black screen (e.g. Day 4 kidnapping)
  endingScript: string[][]; // Changed to array of string arrays (pages)
}

export interface ScriptNode {
  id: string;
  speaker: string | 'Player' | 'System';
  text: string;
  next?: string;
  choices?: {
    text: string;
    next: string;
    effect?: (state: GameState) => Partial<GameState>;
  }[];
}
