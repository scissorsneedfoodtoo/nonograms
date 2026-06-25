import type { UserProgress, PuzzleProgress, CellState } from './types';

const STORAGE_KEY = 'fcc-nonograms-progress-v1';

// Return a fresh object every call. Callers (e.g. savePuzzleProgress) mutate the
// result, so a shared default would get polluted across calls.
function emptyProgress(): UserProgress {
  return {
    stats: {},
    inProgress: {},
  };
}

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return emptyProgress();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return emptyProgress();

  try {
    return JSON.parse(stored);
  } catch (err) {
    console.error('Failed to parse progress from localStorage:', err);
    return emptyProgress();
  }
}

export function saveBestTime(puzzleId: string, time: number) {
  const progress = getProgress();
  const existing = progress.stats[puzzleId];

  if (!existing || time < existing.bestTime) {
    progress.stats[puzzleId] = {
      completed: true,
      bestTime: time,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
}

export function savePuzzleProgress(
  puzzleId: string,
  grid: CellState[][],
  seconds: number,
  penalties: number,
  locked: boolean[][],
) {
  const progress = getProgress();
  progress.inProgress[puzzleId] = {
    grid,
    locked,
    seconds,
    penalties,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function clearPuzzleProgress(puzzleId: string) {
  const progress = getProgress();
  if (progress.inProgress[puzzleId]) {
    delete progress.inProgress[puzzleId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
}

export function getPuzzleProgress(puzzleId: string): PuzzleProgress | null {
  const progress = getProgress();
  return progress.inProgress[puzzleId] || null;
}

export function getPuzzleStats(puzzleId: string) {
  const progress = getProgress();
  return progress.stats[puzzleId] || null;
}

export function clearAllProgress() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
