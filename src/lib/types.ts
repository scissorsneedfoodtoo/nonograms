export type CellState = 'empty' | 'filled' | 'marked';

export interface Puzzle {
  id: string;
  name: string;
  width: number;
  height: number;
  solution: number[][]; // 0 for empty, 1 for filled
  revealColors?: string[][]; // Decorative per-cell colors shown on completion; same dimensions as solution, not used to solve
  rowClues: number[][];
  colClues: number[][];
}

export interface PuzzleStats {
  completed: boolean;
  bestTime: number; // in seconds
}

export interface PuzzleProgress {
  grid: CellState[][];
  locked: boolean[][];
  seconds: number;
  penalties: number;
}

export interface UserProgress {
  stats: Record<string, PuzzleStats>;
  inProgress: Record<string, PuzzleProgress>;
}

export interface GameState {
  locked: boolean[][];
  puzzle: Puzzle;
  isWon: boolean;
  time: number;
  penalties: number;
}
