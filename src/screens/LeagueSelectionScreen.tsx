import { useState } from 'react';
import { Button } from '../components/Button';
import type { League, Difficulty } from '../types';
import { ArrowLeft, Globe, Shield, Trophy, Target, Zap, Shuffle } from 'lucide-react';
import { cn } from '../utils/cn';

interface LeagueSelectionScreenProps {
  onBack: () => void;
  onStart: (league: League, difficulty: Difficulty) => void;
}

const LEAGUES: { name: League; icon: React.FC<any>; color: string }[] = [
  { name: 'Premier League', icon: Trophy, color: 'text-purple-400' },
  { name: 'La Liga', icon: Target, color: 'text-red-400' },
  { name: 'Serie A', icon: Shield, color: 'text-blue-400' },
  { name: 'Bundesliga', icon: Zap, color: 'text-red-500' },
  { name: 'Ligue 1', icon: Globe, color: 'text-yellow-400' },
  { name: 'Champions League', icon: Trophy, color: 'text-blue-300' },
  { name: 'Random', icon: Shuffle, color: 'text-emerald-400' },
];

export function LeagueSelectionScreen({ onBack, onStart }: LeagueSelectionScreenProps) {
  const [selectedLeague, setSelectedLeague] = useState<League>('Premier League');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Medium');

  return (
    <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto py-6">
      
      <button 
        onClick={onBack}
        className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors self-start cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Home
      </button>

      <h2 className="text-3xl font-bold mb-6 text-white">Select a League</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
        {LEAGUES.map((league) => (
          <button
            key={league.name}
            onClick={() => setSelectedLeague(league.name)}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer h-32",
              selectedLeague === league.name 
                ? "bg-slate-800 border-emerald-500 shadow-lg shadow-emerald-500/20" 
                : "bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
            )}
          >
            <league.icon className={cn("w-10 h-10 mb-3", league.color)} />
            <span className="text-sm font-medium text-center">{league.name}</span>
          </button>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-6 text-white">Select Difficulty</h2>
      
      <div className="flex gap-4 mb-12">
        {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((diff) => (
          <button
            key={diff}
            onClick={() => setSelectedDifficulty(diff)}
            className={cn(
              "flex-1 py-4 rounded-xl border-2 font-medium transition-all cursor-pointer",
              selectedDifficulty === diff
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
            )}
          >
            {diff}
          </button>
        ))}
      </div>

      <div className="mt-auto">
        <Button 
          size="lg" 
          className="w-full text-lg shadow-xl shadow-emerald-900/20"
          onClick={() => onStart(selectedLeague, selectedDifficulty)}
        >
          Start Game
        </Button>
      </div>
      
    </div>
  );
}
