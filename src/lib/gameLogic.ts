import type { CellState } from './types';

export function createEmptyGrid(width: number, height: number): CellState[][] {
  return Array.from({ length: height }, () => Array(width).fill('empty'));
}

export function createEmptyLockedGrid(width: number, height: number): boolean[][] {
  return Array.from({ length: height }, () => Array(width).fill(false));
}

export function checkWin(grid: CellState[][], solution: number[][]): boolean {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const isFilled = grid[r][c] === 'filled';
      const solutionFilled = solution[r][c] === 1;
      if (isFilled !== solutionFilled) {
        return false;
      }
    }
  }
  return true;
}

export function isPuzzleInProgress(grid: CellState[][]): boolean {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const isFilledOrMarked = grid[r][c] === 'filled' || grid[r][c] === 'marked';
      if (isFilledOrMarked) {
        return true; // At least one cell is filled or marked, so the puzzle is in progress
      }
    }
  }
  return false;
}

export function toggleCell(current: CellState, action: 'fill' | 'mark'): CellState {
  if (action === 'fill') {
    return current === 'filled' ? 'empty' : 'filled';
  } else {
    return current === 'marked' ? 'empty' : 'marked';
  }
}

export function isLineCorrect(playerLine: CellState[], solutionLine: number[]): boolean {
  for (let i = 0; i < playerLine.length; i++) {
    const isFilled = playerLine[i] === 'filled';
    const solutionFilled = solutionLine[i] === 1;
    if (isFilled !== solutionFilled) {
      return false;
    }
  }
  return true;
}

export function getColumn(grid: CellState[][], colIndex: number): CellState[] {
  return grid.map((row) => row[colIndex]);
}

export function getSolutionColumn(solution: number[][], colIndex: number): number[] {
  return solution.map((row) => row[colIndex]);
}

export function generateClues(line: number[]): number[] {
  const clues: number[] = [];
  let count = 0;
  for (const cell of line) {
    if (cell === 1) {
      count++;
    } else if (count > 0) {
      clues.push(count);
      count = 0;
    }
  }
  if (count > 0) {
    clues.push(count);
  }
  return clues.length > 0 ? clues : [0];
}

export function generateRowClues(solution: number[][]): number[][] {
  return solution.map(generateClues);
}

export function generateColClues(solution: number[][]): number[][] {
  const width = solution[0].length;
  const colClues: number[][] = [];
  for (let c = 0; c < width; c++) {
    colClues.push(generateClues(getSolutionColumn(solution, c)));
  }
  return colClues;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
