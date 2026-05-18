import type { League, Player } from '../types';

const API_KEY = '3';
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

// Map our frontend leagues to TheSportsDB league names
const LEAGUE_MAP: Record<string, string> = {
  'Premier League': 'English Premier League',
  'La Liga': 'Spanish La Liga',
  'Serie A': 'Italian Serie A',
  'Bundesliga': 'German Bundesliga',
  'Ligue 1': 'French Ligue 1',
  'Champions League': 'UEFA Champions League',
};

function calculateAge(dateBorn: string | null): number {
  if (!dateBorn) return 0;
  const birthday = new Date(dateBorn);
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export async function fetchTeams(league: League): Promise<string[]> {
  // Handle Random by picking one of the main 5 leagues
  let targetLeague = league;
  if (league === 'Random') {
    const leagues: League[] = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1'];
    targetLeague = leagues[Math.floor(Math.random() * leagues.length)];
  }

  const queryLeague = LEAGUE_MAP[targetLeague];
  if (!queryLeague) return [];

  try {
    const res = await fetch(`${BASE_URL}/search_all_teams.php?l=${encodeURIComponent(queryLeague)}`);
    const data = await res.json();
    
    if (!data.teams) return [];
    
    // Return an array of Team IDs
    return data.teams.map((t: any) => t.idTeam);
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return [];
  }
}

export async function fetchPlayersForTeams(teamIds: string[], league: League): Promise<Player[]> {
  const allPlayers: Player[] = [];
  
  // Fetch in parallel for the selected teams
  const fetchPromises = teamIds.map(async (teamId) => {
    try {
      const res = await fetch(`${BASE_URL}/lookup_all_players.php?id=${teamId}`);
      const data = await res.json();
      
      if (data.player) {
        data.player.forEach((p: any) => {
          // Filter out non-players or players without images
          // strPosition usually indicates if they are a manager. We want players.
          const isPlayer = p.strPosition && !p.strPosition.toLowerCase().includes('coach') && !p.strPosition.toLowerCase().includes('manager');
          const image = p.strCutout || p.strThumb; // Prefer cutout for cards!

          if (isPlayer && image) {
            allPlayers.push({
              id: p.idPlayer,
              name: p.strPlayer,
              league: league, // Store the league they were fetched for
              club: p.strTeam,
              nationality: p.strNationality,
              position: p.strPosition,
              age: calculateAge(p.dateBorn),
              imageUrl: image
            });
          }
        });
      }
    } catch (e) {
      console.error(`Failed to fetch players for team ${teamId}`, e);
    }
  });

  await Promise.all(fetchPromises);
  return allPlayers;
}
