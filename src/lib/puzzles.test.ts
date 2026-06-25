import { describe, it, expect } from 'vitest';
import { ALL_PUZZLES } from './puzzles';
import { generateRowClues, generateColClues } from './gameLogic';
import { countSolutions } from './solver';

describe('puzzles validation', () => {
  ALL_PUZZLES.forEach((puzzle) => {
    describe(`Puzzle: ${puzzle.name} (id: ${puzzle.id})`, () => {
      it('has row clues matching the solution', () => {
        const generatedRowClues = generateRowClues(puzzle.solution);
        expect(generatedRowClues, `Row clues mismatch in puzzle "${puzzle.name}"`).toEqual(
          puzzle.rowClues
        );
      });

      it('has column clues matching the solution', () => {
        const generatedColClues = generateColClues(puzzle.solution);
        expect(generatedColClues, `Column clues mismatch in puzzle "${puzzle.name}"`).toEqual(
          puzzle.colClues
        );
      });

      it('has correct dimensions', () => {
        expect(puzzle.solution.length).toBe(puzzle.height);
        puzzle.solution.forEach((row, rowIndex) => {
          expect(row.length, `Row ${rowIndex} has incorrect width`).toBe(puzzle.width);
        });
      });

      // Empty rows/columns are allowed: some designs read better with a margin
      // (e.g. the Pizza Slice no longer stretches into a thin tail). They must
      // still be intentional, so the design has to occupy most of the grid —
      // fewer than half the rows and columns may be empty. This scales with the
      // puzzle size, so larger puzzles can afford more empty lines.
      it('keeps any empty rows or columns limited and intentional', () => {
        const emptyRows = puzzle.rowClues.filter(
          (clues) => clues.length === 1 && clues[0] === 0
        ).length;
        const emptyCols = puzzle.colClues.filter(
          (clues) => clues.length === 1 && clues[0] === 0
        ).length;

        expect(
          emptyRows,
          `Puzzle "${puzzle.name}" has too many empty rows (${emptyRows} of ${puzzle.height})`
        ).toBeLessThan(puzzle.height / 2);
        expect(
          emptyCols,
          `Puzzle "${puzzle.name}" has too many empty columns (${emptyCols} of ${puzzle.width})`
        ).toBeLessThan(puzzle.width / 2);
      });

      it('has a unique solution', () => {
        const numSolutions = countSolutions(puzzle.rowClues, puzzle.colClues);
        expect(
          numSolutions,
          `Puzzle "${puzzle.name}" should have exactly 1 solution, but found ${numSolutions}`
        ).toBe(1);
      });
    });
  });
});
