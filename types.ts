

export interface TabooCard {
  word: string;
  bannedWords: string[];
}

export enum GamePhase {
  MENU = 'MENU',
  TEAM_SETUP = 'TEAM_SETUP', // New phase for inputting names
  SETUP = 'SETUP', // Round ready screen
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  ROUND_OVER = 'ROUND_OVER',
  GAME_OVER = 'GAME_OVER',
}

export enum GameMode {
  CLASSIC = 'CLASSIC',     // Infinite score accumulation
  ONE_ROUND = 'ONE_ROUND', // Ends after A and B play once
  RACE = 'RACE',           // First to X round wins
}

export interface Team {
  id: 'A' | 'B';
  name: string;
  score: number; // Total words guessed
  wins: number;  // Rounds won (for Race mode)
  color: string;
  players: string[]; // List of player names
  nextPlayerIndex: number; // Index of who is explaining next
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type Language = 'AZ' | 'EN' | 'RU' | 'ES' | 'FR' | 'PT' | 'AR';

export interface GameSettings {
  roundDuration: number; // in seconds
  difficulty: Difficulty;
  passLimit: number;
  mode: GameMode;
  targetWins: number; // For RACE mode: how many rounds to win
  voiceDetection: boolean; // AI Referee mode
}