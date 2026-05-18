export type League = 
  | 'Premier League' 
  | 'La Liga' 
  | 'Serie A' 
  | 'Bundesliga' 
  | 'Ligue 1' 
  | 'Champions League' 
  | 'Random';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Player {
  id: string;
  name: string;
  league: League;
  club: string;
  nationality: string;
  position: string;
  age: number;
  imageUrl: string;
}

export interface GameState {
  score: number;
  wrongGuesses: number;
  streak: number;
  selectedLeague: League | null;
  difficulty: Difficulty;
  currentPlayer: Player | null;
  playerPool: Player[];
  playedPlayerIds: Set<string>;
  hintsUsed: {
    nationality: boolean;
    club: boolean;
    position: boolean;
    age: boolean;
  };
  hasGuessed: boolean;
  isCorrect: boolean;
  isLoading: boolean;
  error: string | null;
}
