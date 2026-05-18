import { useState, useMemo, useEffect, useRef } from 'react';
import type { GameState } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Trophy, HelpCircle, MapPin, Flag, User, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../utils/cn';

interface GameScreenProps {
  gameState: GameState;
  onGuess: (guess: string) => void;
  onHint: (hintType: keyof GameState['hintsUsed']) => void;
  onSkip: () => void;
  onNext: () => void;
  onQuit: () => void;
}

export function GameScreen({ gameState, onGuess, onHint, onSkip, onNext, onQuit }: GameScreenProps) {
  const [guessInput, setGuessInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { currentPlayer, isCorrect, hasGuessed, difficulty, hintsUsed, score, streak } = gameState;

  // Filter player names for autocomplete
  const suggestions = useMemo(() => {
    if (!guessInput || guessInput.length < 2) return [];
    return gameState.playerPool.filter(p => 
      p.name.toLowerCase().includes(guessInput.toLowerCase())
    ).slice(0, 5); // Max 5 suggestions
  }, [guessInput]);

  useEffect(() => {
    if (hasGuessed && isCorrect) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#ffffff']
      });
    }
  }, [hasGuessed, isCorrect]);

  useEffect(() => {
    if (!hasGuessed && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasGuessed, currentPlayer]);

  const handleGuessSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (guessInput.trim()) {
      onGuess(guessInput.trim());
      setShowSuggestions(false);
    }
  };

  if (gameState.isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium">Scouting players from {gameState.selectedLeague}...</p>
      </div>
    );
  }

  if (gameState.error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 font-medium">{gameState.error}</p>
        <Button onClick={onQuit}>Go Back</Button>
      </div>
    );
  }

  if (!currentPlayer) {
    return <div className="flex-1 flex items-center justify-center">Loading next player...</div>;
  }

  return (
    <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto py-2">
      
      {/* Header Stats */}
      <div className="flex justify-between items-center mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center text-emerald-400">
            <Trophy className="w-5 h-5 mr-2" />
            <span className="font-bold text-lg">{score} pts</span>
          </div>
          <div className="hidden sm:flex items-center text-orange-400">
            <Zap className="w-5 h-5 mr-1" />
            <span className="font-bold">{streak} Streak</span>
          </div>
        </div>
        <div className="text-sm font-medium text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
          {difficulty} Mode
        </div>
        <Button variant="outline" size="sm" onClick={onQuit}>Quit</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start justify-center flex-1">
        
        {/* Player Card Area */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <Card 
            imageUrl={currentPlayer.imageUrl}
            isFlipped={hasGuessed}
            difficulty={difficulty}
            name={currentPlayer.name}
          />
        </div>

        {/* Hints and Input Area */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          
          {/* Hints Area */}
          <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
              <HelpCircle className="w-4 h-4 mr-2" /> Hints
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <HintButton 
                label="Nationality" 
                icon={Flag} 
                value={currentPlayer.nationality} 
                isRevealed={hintsUsed.nationality || hasGuessed}
                onReveal={() => onHint('nationality')}
                penalty="-1"
              />
              <HintButton 
                label="Club" 
                icon={Shield} 
                value={currentPlayer.club} 
                isRevealed={hintsUsed.club || hasGuessed}
                onReveal={() => onHint('club')}
                penalty="-2"
              />
              <HintButton 
                label="Position" 
                icon={MapPin} 
                value={currentPlayer.position} 
                isRevealed={hintsUsed.position || hasGuessed}
                onReveal={() => onHint('position')}
                penalty="-1"
              />
              <HintButton 
                label="Age" 
                icon={User} 
                value={currentPlayer.age.toString()} 
                isRevealed={hintsUsed.age || hasGuessed}
                onReveal={() => onHint('age')}
                penalty="-1"
              />
            </div>
          </div>

          {/* Guess Input Area */}
          <div className="relative mt-auto">
            <form onSubmit={handleGuessSubmit} className="flex gap-2 relative z-20">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Who is this?"
                  className="w-full bg-slate-800 border-2 border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  value={guessInput}
                  onChange={(e) => {
                    setGuessInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  disabled={hasGuessed}
                />
                
                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && !hasGuessed && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-30">
                    {suggestions.map(s => (
                      <div 
                        key={s.id}
                        className="px-4 py-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700/50 last:border-0 text-slate-200"
                        onClick={() => {
                          setGuessInput(s.name);
                          setShowSuggestions(false);
                          // Auto-submit after selection
                          setTimeout(() => onGuess(s.name), 50);
                        }}
                      >
                        {s.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button type="button" variant="secondary" onClick={onSkip} disabled={hasGuessed} className="px-4">
                Skip
              </Button>
              <Button type="submit" disabled={!guessInput.trim() || hasGuessed} className="px-6">
                Guess
              </Button>
            </form>
            
            {/* Show Answer / Next overlay when guessed */}
            {hasGuessed && (
              <div className={cn(
                "mt-4 p-4 rounded-xl border flex justify-between items-center",
                isCorrect ? "bg-emerald-900/40 border-emerald-500/50" : "bg-red-900/40 border-red-500/50"
              )}>
                <div>
                  <h4 className={cn("font-bold text-lg", isCorrect ? "text-emerald-400" : "text-red-400")}>
                    {isCorrect ? "Correct!" : "Wrong!"}
                  </h4>
                  <p className="text-slate-300 text-sm">It was <span className="font-bold text-white">{currentPlayer.name}</span></p>
                </div>
                <Button onClick={() => {
                  setGuessInput('');
                  onNext();
                }}>
                  Next Player <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
          
        </div>
      </div>

    </div>
  );
}

// Subcomponents for icons
const Shield = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const Zap = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;

function HintButton({ label, icon: Icon, value, isRevealed, onReveal, penalty }: any) {
  return (
    <button
      onClick={onReveal}
      disabled={isRevealed}
      className={cn(
        "flex flex-col items-center justify-center p-3 rounded-lg border transition-all h-24",
        isRevealed 
          ? "bg-slate-700/50 border-slate-600 cursor-default" 
          : "bg-slate-800 border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700 cursor-pointer group"
      )}
    >
      <Icon className={cn("w-5 h-5 mb-2", isRevealed ? "text-emerald-400" : "text-slate-400 group-hover:text-emerald-400")} />
      {isRevealed ? (
        <span className="text-sm font-bold text-white text-center break-words w-full px-1">{value}</span>
      ) : (
        <div className="text-center">
          <span className="text-xs text-slate-400 block">{label}</span>
          <span className="text-[10px] text-red-400 font-medium">{penalty} pt</span>
        </div>
      )}
    </button>
  );
}
