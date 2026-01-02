'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { getRandomWordFromAll, getAllWords } from '@/data/spanishWords';
import Timer from './Timer';
import WordDisplay from './WordDisplay';
import PlayerList from './PlayerList';
import GameControls from './GameControls';
import { storage } from '@/utils/storage';

export interface Player {
  id: string;
  name: string;
  score: number;
}

interface GameState {
  isPlaying: boolean;
  currentPlayerIndex: number;
  currentWord: string;
  timeRemaining: number;
  wordsGuessed: number;
}

const DEFAULT_PLAYERS: Player[] = [
  { id: '1', name: 'Jugador 1', score: 0 },
  { id: '2', name: 'Jugador 2', score: 0 },
];

export default function Game() {
  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
  const [isInitialized, setIsInitialized] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    currentPlayerIndex: 0,
    currentWord: '',
    timeRemaining: 60,
    wordsGuessed: 0,
  });

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPassingTurnRef = useRef<boolean>(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [totalWordsGuessed, setTotalWordsGuessed] = useState(0);
  const [isPassingDevice, setIsPassingDevice] = useState(false);
  const [usedWords, setUsedWords] = useState<string[]>([]); // Track ALL words used in current session
  const [isPaused, setIsPaused] = useState(false);

  // Load saved players on mount
  useEffect(() => {
    const savedPlayers = storage.getSavedPlayers();
    if (savedPlayers && savedPlayers.length > 0) {
      setPlayers(savedPlayers);
    }
    setIsInitialized(true);
  }, []);

  // Save players whenever they change (but not during initialization)
  useEffect(() => {
    if (isInitialized) {
      storage.savePlayers(players);
    }
  }, [players, isInitialized]);

  const getNewWord = useCallback(() => {
    const allWords = getAllWords();
    
    // Filter out ALL words used in this session
    const availableWords = allWords.filter((word: string) => !usedWords.includes(word));
    
    let selectedWord: string;
    
    // If we've used all words (unlikely but handle it), reset and start over
    if (availableWords.length === 0) {
      // Reset used words and pick from all words
      selectedWord = allWords[Math.floor(Math.random() * allWords.length)];
      setUsedWords([selectedWord]);
    } else {
      // Pick a random word from available words (words not yet used)
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      selectedWord = availableWords[randomIndex];
      
      // Add to used words list (track ALL words used in this session)
      setUsedWords(prev => [...prev, selectedWord]);
    }
    
    return selectedWord;
  }, [usedWords]);

  const clearTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    
    const interval = setInterval(() => {
      setGameState(prev => {
        // Don't count down if paused
        if (isPaused) {
          return prev;
        }
        
        if (prev.timeRemaining <= 1) {
          clearInterval(interval);
          timerIntervalRef.current = null;
          // Don't set isPlaying to false here - let passTurn handle it
          // This ensures the score is added before the turn ends
          return {
            ...prev,
            timeRemaining: 0,
          };
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        };
      });
    }, 1000);
    
    timerIntervalRef.current = interval;
  }, [clearTimer, isPaused]);

  const startGame = () => {
    if (gameState.isPlaying) return;
    
    // Reset used words when starting a new game session
    setUsedWords([]);
    
    const newWord = getNewWord();
    setGameStartTime(Date.now());
    setTotalWordsGuessed(0);
    setGameState({
      isPlaying: true,
      currentPlayerIndex: 0,
      currentWord: newWord,
      timeRemaining: 60,
      wordsGuessed: 0,
    });

    startTimer();
  };

  const nextWord = useCallback(() => {
    if (!gameState.isPlaying) return;
    
    const newWord = getNewWord();
    // Each word guessed correctly adds 1 to the counter
    // The score will be added when the turn ends
    setGameState(prev => {
      const newWordsGuessed = prev.wordsGuessed + 1;
      setTotalWordsGuessed(prevTotal => prevTotal + 1);
      return {
        ...prev,
        currentWord: newWord,
        wordsGuessed: newWordsGuessed,
      };
    });
  }, [gameState.isPlaying, getNewWord]);

  const skipWord = useCallback(() => {
    if (!gameState.isPlaying) return;
    
    // Get a new word without incrementing the counter
    // The word is still added to usedWords list (via getNewWord) so it won't repeat
    const newWord = getNewWord();
    setGameState(prev => ({
      ...prev,
      currentWord: newWord,
      // wordsGuessed stays the same - we're skipping, not guessing correctly
    }));
  }, [gameState.isPlaying, getNewWord]);

  const passTurn = useCallback(() => {
    // Prevent multiple simultaneous calls
    if (isPassingTurnRef.current) return;
    
    // Only proceed if game is playing OR timer just reached 0
    if (!gameState.isPlaying && gameState.timeRemaining !== 0) return;
    
    isPassingTurnRef.current = true;

    // Clear existing timer
    clearTimer();

    // Get current state values before updating
    const currentPlayerIndex = gameState.currentPlayerIndex;
    const wordsGuessed = gameState.wordsGuessed;

    // Update current player's score (only if words were guessed)
    if (wordsGuessed > 0) {
      setPlayers(prev => {
        const updated = [...prev];
        updated[currentPlayerIndex].score += wordsGuessed;
        return updated;
      });
    }

    // Calculate next player index
    setPlayers(prev => {
      const nextPlayerIndex = (currentPlayerIndex + 1) % prev.length;
      const newWord = getNewWord();
      
      // Show "passing device" message - waiting for manual start
      setIsPassingDevice(true);
      setGameState({
        isPlaying: false, // Not playing yet - waiting to pass device
        currentPlayerIndex: nextPlayerIndex,
        currentWord: newWord,
        timeRemaining: 60,
        wordsGuessed: 0,
      });
      
      isPassingTurnRef.current = false; // Allow next turn to start
      
      return prev; // Don't modify players here
    });
  }, [gameState.isPlaying, gameState.currentPlayerIndex, gameState.wordsGuessed, gameState.timeRemaining, clearTimer, startTimer, getNewWord]);

  const resetGame = () => {
    clearTimer();
    isPassingTurnRef.current = false;
    
    // Save game to history if it was played
    if (gameStartTime && totalWordsGuessed > 0) {
      const duration = Math.floor((Date.now() - gameStartTime) / 1000);
      storage.addGameToHistory({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        players: players.map(p => ({ ...p })),
        totalWords: totalWordsGuessed,
        duration,
      });
    }
    
    setGameStartTime(null);
    setTotalWordsGuessed(0);
    setIsPassingDevice(false);
    setIsPaused(false);
    setUsedWords([]); // Reset used words when resetting the game
    setPlayers(prev => prev.map(p => ({ ...p, score: 0 })));
    setGameState({
      isPlaying: false,
      currentPlayerIndex: 0,
      currentWord: '',
      timeRemaining: 60,
      wordsGuessed: 0,
    });
  };

  const addPlayer = () => {
    // Generate a unique ID based on timestamp
    const newId = Date.now().toString();
    setPlayers([...players, { id: newId, name: `Jugador ${players.length + 1}`, score: 0 }]);
  };

  const removePlayer = (id: string) => {
    if (players.length <= 2) return;
    setPlayers(players.filter(p => p.id !== id));
  };

  const updatePlayerName = (id: string, name: string) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, name } : p));
  };

  const startNextTurn = () => {
    if (!isPassingDevice) return;
    
    setIsPassingDevice(false);
    setIsPaused(false); // Make sure we're not paused when starting
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
    }));
    
    // Start new timer
    setTimeout(() => {
      startTimer();
    }, 100);
  };

  const pauseGame = () => {
    if (!gameState.isPlaying || isPassingDevice) return;
    setIsPaused(true);
    // Stop the timer completely when paused
    clearTimer();
  };

  const resumeGame = () => {
    if (!isPaused) return;
    setIsPaused(false);
    // Restart the timer when resuming
    startTimer();
  };

  // Keyboard event handler for spacebar
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      
      // Only trigger if game is playing and spacebar is pressed
      if (event.code === 'Space' && gameState.isPlaying && !isPassingDevice && !isPaused) {
        event.preventDefault();
        nextWord();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameState.isPlaying, isPassingDevice, isPaused, nextWord]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  // Auto-pass turn when timer reaches 0
  useEffect(() => {
    if (gameState.timeRemaining === 0 && gameState.isPlaying && !isPassingTurnRef.current) {
      // Small delay to ensure state is updated
      const timeout = setTimeout(() => {
        passTurn();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [gameState.timeRemaining, gameState.isPlaying, passTurn]);

  const currentPlayer = players[gameState.currentPlayerIndex];

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-10">
          <div className="relative" style={{ maxWidth: '95vw' }}>
            <Image 
              src="/logo.png" 
              alt="¡AtrapaPalabra! ¡DÍLA...SI PUEDES!" 
              width={2000}
              height={500}
              className="w-full h-auto max-h-32 md:max-h-[500px]"
              style={{ 
                objectFit: 'contain',
                margin: '0 auto',
                display: 'block'
              }}
              priority
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 relative">
              {/* Pause and Pass Turn links in upper right */}
              {!isPassingDevice && !isPaused && gameState.isPlaying && (
                <div className="absolute top-4 right-4 flex gap-4 text-sm">
                  <button
                    onClick={pauseGame}
                    className="text-gray-600 hover:text-orange-600 underline decoration-2 underline-offset-2 transition-colors"
                  >
                    ⏸️ Pausar
                  </button>
                  <button
                    onClick={passTurn}
                    className="text-gray-600 hover:text-purple-600 underline decoration-2 underline-offset-2 transition-colors"
                  >
                    ⏭️ Pasar Turno
                  </button>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Turno de: <span className="text-purple-600">{currentPlayer.name}</span>
                </h2>
                {!isPassingDevice && !isPaused && (
                  <Timer timeRemaining={gameState.timeRemaining} isPlaying={gameState.isPlaying} />
                )}
              </div>

              {isPassingDevice ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-2xl border-2 border-gray-300">
                  <h3 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
                    ⏸️ Pasa el dispositivo
                  </h3>
                  <p className="text-2xl md:text-3xl text-gray-700 mb-8">
                    Turno de: <span className="font-bold">{players[gameState.currentPlayerIndex]?.name}</span>
                  </p>
                  <button
                    onClick={startNextTurn}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-12 rounded-xl shadow-2xl transform transition-all hover:scale-105 active:scale-95 text-2xl"
                  >
                    ▶️ Comenzar Turno
                  </button>
                </div>
              ) : isPaused ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-2xl border-2 border-gray-300">
                  <h3 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
                    ⏸️ Pausado
                  </h3>
                  <p className="text-2xl md:text-3xl text-gray-700 mb-8">
                    Tiempo restante: <span className="font-bold">{gameState.timeRemaining}s</span>
                  </p>
                  <button
                    onClick={resumeGame}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-12 rounded-xl shadow-2xl transform transition-all hover:scale-105 active:scale-95 text-2xl"
                  >
                    ▶️ Reanudar
                  </button>
                </div>
              ) : (
                <WordDisplay word={gameState.currentWord} />
              )}

              {!isPassingDevice && !isPaused && (
                <>
                  <div className="mt-6 text-center">
                    <p className="text-lg text-gray-600 mb-2">
                      Palabras adivinadas: <span className="font-bold text-green-600">{gameState.wordsGuessed}</span>
                    </p>
                  </div>

                  <GameControls
                    isPlaying={gameState.isPlaying}
                    isPaused={isPaused}
                    onStart={startGame}
                    onNextWord={nextWord}
                    onSkipWord={skipWord}
                    onResume={resumeGame}
                    onReset={resetGame}
                  />
                </>
              )}
            </div>
          </div>

          {/* Player List Sidebar */}
          <div className="lg:col-span-1">
            <PlayerList
              players={players}
              currentPlayerId={currentPlayer.id}
              onAddPlayer={addPlayer}
              onRemovePlayer={removePlayer}
              onUpdatePlayerName={updatePlayerName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

