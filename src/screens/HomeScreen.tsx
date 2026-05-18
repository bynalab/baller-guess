import { Trophy, Play, Star, Settings } from 'lucide-react';
import { Button } from '../components/Button';

interface HomeScreenProps {
  onPlayClick: () => void;
  onHighScoresClick: () => void;
}

export function HomeScreen({ onPlayClick, onHighScoresClick }: HomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full gap-8">
      
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-full mb-2 border border-emerald-500/20">
          <Trophy className="w-16 h-16 text-emerald-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
          Baller<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Guess</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-md mx-auto">
          Guess the football star from blurred cards and mystery clues. Build streaks and solve a new football puzzle every round!
        </p>
      </div>

      <div className="w-full flex flex-col gap-4 mt-8">
        <Button size="lg" onClick={onPlayClick} className="w-full group">
          <Play className="w-5 h-5 mr-2 fill-current group-hover:scale-110 transition-transform" />
          Play Now
        </Button>
        
        <Button size="lg" variant="secondary" onClick={onHighScoresClick} className="w-full">
          <Star className="w-5 h-5 mr-2" />
          High Scores
        </Button>

        <Button size="lg" variant="outline" className="w-full">
          <Settings className="w-5 h-5 mr-2" />
          Settings
        </Button>
      </div>

      <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-center w-full">
        <h3 className="font-semibold text-emerald-400 mb-1">Daily Challenge</h3>
        <p className="text-sm text-slate-400 mb-3">Guess 5 legends in a row!</p>
        <Button size="sm" variant="outline" className="w-full">Play Daily Challenge</Button>
      </div>
      
    </div>
  );
}
