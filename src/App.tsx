import { useState } from 'react';
import { Layout } from './components/Layout';
import { HomeScreen } from './screens/HomeScreen';
import { LeagueSelectionScreen } from './screens/LeagueSelectionScreen';
import { GameScreen } from './screens/GameScreen';
import { useGame } from './hooks/useGame';
import type { League, Difficulty } from './types';

type ScreenState = 'HOME' | 'LEAGUE_SELECTION' | 'GAME' | 'HIGH_SCORES';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('HOME');
  const { gameState, startGame, getNextPlayer, makeGuess, skipPlayer, revealHint, resetGame } = useGame();

  const handleStartGame = (league: League, difficulty: Difficulty) => {
    startGame(league, difficulty);
    setCurrentScreen('GAME');
  };

  const handleQuit = () => {
    resetGame();
    setCurrentScreen('HOME');
  };

  return (
    <Layout>
      {currentScreen === 'HOME' && (
        <HomeScreen 
          onPlayClick={() => setCurrentScreen('LEAGUE_SELECTION')}
          onHighScoresClick={() => setCurrentScreen('HIGH_SCORES')}
        />
      )}

      {currentScreen === 'LEAGUE_SELECTION' && (
        <LeagueSelectionScreen 
          onBack={() => setCurrentScreen('HOME')}
          onStart={handleStartGame}
        />
      )}

      {currentScreen === 'GAME' && (
        <GameScreen 
          gameState={gameState}
          onGuess={makeGuess}
          onHint={revealHint}
          onSkip={skipPlayer}
          onNext={getNextPlayer}
          onQuit={handleQuit}
        />
      )}

      {currentScreen === 'HIGH_SCORES' && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold mb-4">High Scores</h2>
          <p className="text-slate-400 mb-8">Coming soon in future updates!</p>
          <button 
            onClick={() => setCurrentScreen('HOME')}
            className="text-emerald-400 hover:text-emerald-300"
          >
            Back to Home
          </button>
        </div>
      )}
    </Layout>
  );
}

export default App;
