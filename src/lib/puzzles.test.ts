import { describe, it, expect } from 'vitest';
import { ALL_PUZZLES } from './puzzles';
import { generateRowClues, generateColClues } from './gameLogic';
import { countSolutions } from './solver';

describe('puzzles validation', () => {
  ALL_PUZZLES.forEach((puzzle) => {
    describe(`Puzzle: ${puzzle.name} (id: ${puzzle.id})`, () => {
      it('has row clues matching the solution', () => {
        const generatedRowClues = generateRowClues(puzzle.solution);
        expect(generatedRowClues, `Row clues mismatch in puzzle "${puzzle.name}"`).toEqual(puzzle.rowClues);
      });

      it('has column clues matching the solution', () => {
        const generatedColClues = generateColClues(puzzle.solution);
        expect(generatedColClues, `Column clues mismatch in puzzle "${puzzle.name}"`).toEqual(puzzle.colClues);
      });

      it('has correct dimensions', () => {
        expect(puzzle.solution.length).toBe(puzzle.height);
        puzzle.solution.forEach((row, rowIndex) => {
          expect(row.length, `Row ${rowIndex} has incorrect width`).toBe(puzzle.width);
        });
      });

      it('has a unique solution', () => {
        const numSolutions = countSolutions(puzzle.rowClues, puzzle.colClues);
        expect(numSolutions, `Puzzle "${puzzle.name}" should have exactly 1 solution, but found ${numSolutions}`).toBe(1);
      });
    });
  });
});
