import { Player } from '@/components/Game';

const STORAGE_KEYS = {
  PLAYERS: 'spanish-catch-phrase-players',
  GAME_HISTORY: 'spanish-catch-phrase-history',
} as const;

export interface GameHistoryEntry {
  id: string;
  date: string;
  players: Player[];
  totalWords: number;
  duration: number; // in seconds
}

export const storage = {
  // Player names persistence
  getSavedPlayers: (): Player[] | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLAYERS);
      if (saved) {
        const players = JSON.parse(saved);
        // Reset scores to 0 when loading
        return players.map((p: Player) => ({ ...p, score: 0 }));
      }
    } catch (error) {
      console.error('Error loading saved players:', error);
    }
    return null;
  },

  savePlayers: (players: Player[]): void => {
    if (typeof window === 'undefined') return;
    
    try {
      // Save only names and IDs, not scores
      const playersToSave = players.map(({ id, name }) => ({ id, name }));
      localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(playersToSave));
    } catch (error) {
      console.error('Error saving players:', error);
    }
  },

  // Game history persistence
  getGameHistory: (): GameHistoryEntry[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading game history:', error);
    }
    return [];
  },

  saveGameHistory: (history: GameHistoryEntry[]): void => {
    if (typeof window === 'undefined') return;
    
    try {
      // Keep only last 50 games
      const limitedHistory = history.slice(-50);
      localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('Error saving game history:', error);
    }
  },

  addGameToHistory: (entry: GameHistoryEntry): void => {
    const history = storage.getGameHistory();
    history.push(entry);
    storage.saveGameHistory(history);
  },

  clearGameHistory: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.GAME_HISTORY);
  },
};

