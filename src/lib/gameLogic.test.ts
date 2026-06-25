import { describe, it, expect } from 'vitest';
import {
  generateClues,
  generateRowClues,
  generateColClues,
  createEmptyGrid,
  createEmptyLockedGrid,
  checkWin,
  isPuzzleInProgress,
  toggleCell,
  isLineCorrect,
  getColumn,
  getSolutionColumn,
  formatTime,
  totalPenaltySeconds,
  penaltyForMistake,
} from './gameLogic';

describe('gameLogic', () => {
  describe('createEmptyGrid', () => {
    it('creates a grid of the correct dimensions filled with "empty"', () => {
      const grid = createEmptyGrid(3, 2);
      expect(grid).toEqual([
        ['empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty'],
      ]);
    });
  });

  describe('createEmptyLockedGrid', () => {
    it('creates a grid of the correct dimensions filled with false', () => {
      const grid = createEmptyLockedGrid(2, 3);
      expect(grid).toEqual([
        [false, false],
        [false, false],
        [false, false],
      ]);
    });
  });

  describe('checkWin', () => {
    const solution = [
      [1, 0],
      [0, 1],
    ];

    it('returns true when the grid matches the solution', () => {
      const grid = [
        ['filled', 'empty'],
        ['empty', 'filled'],
      ];
      // @ts-expect-error intentionally passing untyped test data
      expect(checkWin(grid, solution)).toBe(true);
    });

    it('returns false when the grid does not match (missing fill)', () => {
      const grid = [
        ['filled', 'empty'],
        ['empty', 'empty'],
      ];
      // @ts-expect-error intentionally passing untyped test data
      expect(checkWin(grid, solution)).toBe(false);
    });

    it('returns false when the grid has extra fill', () => {
      const grid = [
        ['filled', 'filled'],
        ['empty', 'filled'],
      ];
      // @ts-expect-error intentionally passing untyped test data
      expect(checkWin(grid, solution)).toBe(false);
    });

    it('returns true regardless of "marked" cells as long as fills are correct', () => {
      const grid = [
        ['filled', 'marked'],
        ['empty', 'filled'],
      ];
      // @ts-expect-error intentionally passing untyped test data
      expect(checkWin(grid, solution)).toBe(true);
    });
  });

  describe('isPuzzleInProgress', () => {
    it('returns false for an empty grid', () => {
      const grid = [
        ['empty', 'empty'],
        ['empty', 'empty'],
      ];
      // @ts-expect-error intentionally passing untyped test data
      expect(isPuzzleInProgress(grid)).toBe(false);
    });

    it('returns true if a cell is filled', () => {
      const grid = [
        ['empty', 'filled'],
        ['empty', 'empty'],
      ];
      // @ts-expect-error intentionally passing untyped test data
      expect(isPuzzleInProgress(grid)).toBe(true);
    });

    it('returns true if a cell is marked', () => {
      const grid = [
        ['empty', 'empty'],
        ['marked', 'empty'],
      ];
      // @ts-expect-error intentionally passing untyped test data
      expect(isPuzzleInProgress(grid)).toBe(true);
    });
  });

  describe('toggleCell', () => {
    it('toggles "empty" to "filled" when filling', () => {
      expect(toggleCell('empty', 'fill')).toBe('filled');
    });

    it('toggles "filled" to "empty" when filling', () => {
      expect(toggleCell('filled', 'fill')).toBe('empty');
    });

    it('toggles "empty" to "marked" when marking', () => {
      expect(toggleCell('empty', 'mark')).toBe('marked');
    });

    it('toggles "marked" to "empty" when marking', () => {
      expect(toggleCell('marked', 'mark')).toBe('empty');
    });

    it('changes "marked" to "filled" when filling', () => {
      expect(toggleCell('marked', 'fill')).toBe('filled');
    });

    it('changes "filled" to "marked" when marking', () => {
      expect(toggleCell('filled', 'mark')).toBe('marked');
    });
  });

  describe('isLineCorrect', () => {
    const solutionLine = [1, 0, 1];

    it('returns true if filled cells match', () => {
      expect(isLineCorrect(['filled', 'empty', 'filled'], solutionLine)).toBe(true);
    });

    it('returns true if marked cells are in empty spots', () => {
      expect(isLineCorrect(['filled', 'marked', 'filled'], solutionLine)).toBe(true);
    });

    it('returns false if a fill is missing', () => {
      expect(isLineCorrect(['filled', 'empty', 'empty'], solutionLine)).toBe(false);
    });

    it('returns false if an empty spot is filled', () => {
      expect(isLineCorrect(['filled', 'filled', 'filled'], solutionLine)).toBe(false);
    });
  });

  describe('getColumn', () => {
    it('extracts a column from a grid', () => {
      const grid = [
        [1, 2, 3],
        [4, 5, 6],
      ];
      // @ts-expect-error intentionally passing untyped test data
      expect(getColumn(grid, 1)).toEqual([2, 5]);
    });
  });

  describe('getSolutionColumn', () => {
    it('extracts a column from a solution matrix', () => {
      const solution = [
        [1, 0],
        [1, 1],
        [0, 1],
      ];
      expect(getSolutionColumn(solution, 0)).toEqual([1, 1, 0]);
    });
  });

  describe('generateClues', () => {
    it('generates clues for a simple line', () => {
      expect(generateClues([1, 1, 0, 1])).toEqual([2, 1]);
    });

    it('generates [0] for an empty line', () => {
      expect(generateClues([0, 0, 0])).toEqual([0]);
    });

    it('generates clues for a full line', () => {
      expect(generateClues([1, 1, 1])).toEqual([3]);
    });

    it('generates clues for alternating cells', () => {
      expect(generateClues([1, 0, 1, 0, 1])).toEqual([1, 1, 1]);
    });
  });

  describe('generateRowClues', () => {
    it('generates row clues for a 2x2 solution', () => {
      const solution = [
        [1, 0],
        [1, 1],
      ];
      expect(generateRowClues(solution)).toEqual([[1], [2]]);
    });
  });

  describe('generateColClues', () => {
    it('generates column clues for a 2x2 solution', () => {
      const solution = [
        [1, 0],
        [1, 1],
      ];
      expect(generateColClues(solution)).toEqual([[2], [1]]);
    });
  });

  describe('formatTime', () => {
    it('formats seconds into M:SS', () => {
      expect(formatTime(0)).toBe('0:00');
      expect(formatTime(5)).toBe('0:05');
      expect(formatTime(65)).toBe('1:05');
      expect(formatTime(600)).toBe('10:00');
    });
  });

  describe('penaltyForMistake', () => {
    it('charges step * mistake number, escalating linearly', () => {
      expect(penaltyForMistake(1, 30)).toBe(30);
      expect(penaltyForMistake(2, 30)).toBe(60);
      expect(penaltyForMistake(3, 30)).toBe(90);
    });
  });

  describe('totalPenaltySeconds', () => {
    it('is zero with no mistakes', () => {
      expect(totalPenaltySeconds(0, 30)).toBe(0);
    });

    it('accumulates the escalating per-mistake penalties', () => {
      // 30, 30+60, 30+60+90, 30+60+90+120
      expect(totalPenaltySeconds(1, 30)).toBe(30);
      expect(totalPenaltySeconds(2, 30)).toBe(90);
      expect(totalPenaltySeconds(3, 30)).toBe(180);
      expect(totalPenaltySeconds(4, 30)).toBe(300);
    });

    it('equals the running sum of penaltyForMistake', () => {
      const step = 30;
      let running = 0;
      for (let n = 1; n <= 6; n++) {
        running += penaltyForMistake(n, step);
        expect(totalPenaltySeconds(n, step)).toBe(running);
      }
    });
  });
});
