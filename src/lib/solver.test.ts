import { describe, it, expect } from 'vitest';
import { generatePossibleLines, countSolutions } from './solver';

describe('solver', () => {
  describe('generatePossibleLines', () => {
    it('generates correct patterns for [2, 1] with length 5', () => {
      const patterns = generatePossibleLines([2, 1], 5);
      // Possible patterns:
      // 1 1 0 1 0
      // 1 1 0 0 1
      // 0 1 1 0 1
      expect(patterns).toContainEqual([1, 1, 0, 1, 0]);
      expect(patterns).toContainEqual([1, 1, 0, 0, 1]);
      expect(patterns).toContainEqual([0, 1, 1, 0, 1]);
      expect(patterns.length).toBe(3);
    });

    it('generates [0, 0, 0] for clue [0] and length 3', () => {
      expect(generatePossibleLines([0], 3)).toEqual([[0, 0, 0]]);
    });
  });

  describe('countSolutions', () => {
    it('returns 1 for a simple unique 2x2 puzzle', () => {
      const rowClues = [[1], [1]];
      const colClues = [[1], [1]];
      // Solution:
      // 1 0
      // 0 1
      // OR
      // 0 1
      // 1 0
      // Wait, [1], [1] is NOT unique for 2x2 if they can be anywhere.
      // 1 0
      // 0 1
      // and
      // 0 1
      // 1 0
      // both satisfy clues.
      expect(countSolutions(rowClues, colClues)).toBe(2);
    });

    it('returns 1 for a unique 2x2 puzzle', () => {
      const rowClues = [[2], [1]];
      const colClues = [[2], [1]];
      // Solution:
      // 1 1
      // 1 0
      expect(countSolutions(rowClues, colClues)).toBe(1);
    });
  });
});
