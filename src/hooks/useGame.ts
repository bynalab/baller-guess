import { useState, useCallback, useEffect, useRef } from 'react';
import type { League, Difficulty, GameState } from '../types';
import { fetchTeams, fetchPlayersForTeams } from '../utils/api';

const INITIAL_STATE: GameState = {
  score: 0,
  wrongGuesses: 0,
  streak: 0,
  selectedLeague: null,
  difficulty: 'Medium',
  currentPlayer: null,
  playerPool: [],
  playedPlayerIds: new Set<string>(),
  hintsUsed: {
    nationality: false,
    club: false,
    position: false,
    age: false,
  },
  hasGuessed: false,
  isCorrect: false,
  isLoading: false,
  error: null,
};

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  
  // Ref to track if we are already fetching to prevent double fetches on mount
  const isFetchingRef = useRef(false);

  const loadPlayersForLeague = useCallback(async (league: League) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    setGameState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const allTeamIds = await fetchTeams(league);
      
      if (allTeamIds.length === 0) {
        setGameState(prev => ({ ...prev, isLoading: false, error: 'Failed to load teams for this league.' }));
        isFetchingRef.current = false;
        return;
      }

      // Pick 3 random teams to form the initial pool
      const shuffledTeams = allTeamIds.sort(() => 0.5 - Math.random());
      const selectedTeams = shuffledTeams.slice(0, 3);
      
      const newPlayers = await fetchPlayersForTeams(selectedTeams, league);

      if (newPlayers.length === 0) {
        setGameState(prev => ({ ...prev, isLoading: false, error: 'Failed to load players.' }));
        isFetchingRef.current = false;
        return;
      }

      setGameState(prev => ({ 
        ...prev, 
        playerPool: newPlayers,
        isLoading: false
      }));

    } catch (e) {
      setGameState(prev => ({ ...prev, isLoading: false, error: 'Network error occurred.' }));
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  const startGame = useCallback((league: League, difficulty: Difficulty) => {
    setGameState({
      ...INITIAL_STATE,
      selectedLeague: league,
      difficulty,
      isLoading: true, // Optimistically set loading
    });
    
    // Kick off the API fetch
    loadPlayersForLeague(league);
  }, [loadPlayersForLeague]);

  const getNextPlayer = useCallback(() => {
    setGameState(prev => {
      if (!prev.selectedLeague || prev.playerPool.length === 0) return prev;

      const availablePlayers = prev.playerPool.filter(p => !prev.playedPlayerIds.has(p.id));
      
      if (availablePlayers.length === 0) {
        // We ran out of players in the pool. Ideally, we should fetch more teams here.
        // For simplicity, we just clear played history and reuse the pool.
        prev.playedPlayerIds.clear();
        return {
          ...prev,
          currentPlayer: prev.playerPool[Math.floor(Math.random() * prev.playerPool.length)],
          playedPlayerIds: new Set([prev.playerPool[0].id]),
          hasGuessed: false,
          isCorrect: false,
          hintsUsed: { nationality: false, club: false, position: false, age: false }
        };
      }

      const randomPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
      const newPlayedIds = new Set(prev.playedPlayerIds);
      newPlayedIds.add(randomPlayer.id);

      return {
        ...prev,
        currentPlayer: randomPlayer,
        playedPlayerIds: newPlayedIds,
        hasGuessed: false,
        isCorrect: false,
        hintsUsed: {
          nationality: false,
          club: false,
          position: false,
          age: false,
        }
      };
    });
  }, []);

  // When playerPool is populated but no current player is set, get the first player
  useEffect(() => {
    if (gameState.selectedLeague && !gameState.currentPlayer && gameState.playerPool.length > 0) {
      getNextPlayer();
    }
  }, [gameState.selectedLeague, gameState.currentPlayer, gameState.playerPool.length, getNextPlayer]);

  const makeGuess = useCallback((guessName: string) => {
    setGameState(prev => {
      if (!prev.currentPlayer || prev.hasGuessed) return prev;

      const isCorrect = prev.currentPlayer.name.toLowerCase() === guessName.toLowerCase();
      
      // Calculate hint penalties
      let penalty = 0;
      if (prev.hintsUsed.nationality) penalty += 1;
      if (prev.hintsUsed.club) penalty += 2;
      if (prev.hintsUsed.position) penalty += 1;
      if (prev.hintsUsed.age) penalty += 1;

      let scoreDelta = 0;
      if (isCorrect) {
        scoreDelta = Math.max(1, 10 - penalty);
      }

      return {
        ...prev,
        hasGuessed: true,
        isCorrect,
        score: isCorrect ? prev.score + scoreDelta : prev.score,
        streak: isCorrect ? prev.streak + 1 : 0,
        wrongGuesses: isCorrect ? prev.wrongGuesses : prev.wrongGuesses + 1,
      };
    });
  }, []);

  const revealHint = useCallback((hintType: keyof GameState['hintsUsed']) => {
    setGameState(prev => ({
      ...prev,
      hintsUsed: {
        ...prev.hintsUsed,
        [hintType]: true
      }
    }));
  }, []);

  const skipPlayer = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPlayer || prev.hasGuessed) return prev;
      return {
        ...prev,
        hasGuessed: true,
        isCorrect: false,
        streak: 0,
        wrongGuesses: prev.wrongGuesses + 1,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(INITIAL_STATE);
  }, []);

  return {
    gameState,
    startGame,
    getNextPlayer,
    makeGuess,
    skipPlayer,
    revealHint,
    resetGame,
  };
}
