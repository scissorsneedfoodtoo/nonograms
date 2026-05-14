export type CellState = 'empty' | 'filled' | 'marked';

export interface Puzzle {
  id: number;
  name: string;
  width: number;
  height: number;
  solution: number[][]; // 0 for empty, 1 for filled
  colorSolution?: string[][]; // Hex codes or CSS colors for completed view
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
  stats: Record<number, PuzzleStats>;
  inProgress: Record<number, PuzzleProgress>;
}

export interface GameState {
  locked: boolean[][];
  puzzle: Puzzle;
  isWon: boolean;
  time: number;
  penalties: number;
}
