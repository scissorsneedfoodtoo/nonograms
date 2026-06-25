import { describe, it, expect } from 'vitest';
import { TUTORIAL_PUZZLE, TUTORIAL_STEPS } from './tutorial';
import { generateRowClues, generateColClues } from './gameLogic';
import { countSolutions, generatePossibleLines } from './solver';
import { ALL_PUZZLES } from './puzzles';

/**
 * Standard nonogram line-solving: repeatedly, for every row and column, keep the
 * line completions still consistent with what's known and lock in any cell they
 * all agree on. Returns the grid of forced values (-1 = still undetermined).
 * This captures exactly the deductions a player can make without guessing.
 */
function forcedCells(
  rowClues: number[][],
  colClues: number[][],
  width: number,
  height: number,
  known: number[][]
): number[][] {
  const grid = known.map((row) => [...row]);
  let changed = true;
  while (changed) {
    changed = false;
    const lock = (
      cells: number[],
      clue: number[],
      len: number,
      set: (i: number, v: number) => void
    ) => {
      const options = generatePossibleLines(clue, len).filter((p) =>
        p.every((v, i) => cells[i] === -1 || cells[i] === v)
      );
      for (let i = 0; i < len; i++) {
        if (cells[i] !== -1) continue;
        const vals = new Set(options.map((p) => p[i]));
        if (vals.size === 1) {
          set(i, vals.values().next().value!);
          changed = true;
        }
      }
    };
    for (let r = 0; r < height; r++) {
      lock(grid[r], rowClues[r], width, (c, v) => (grid[r][c] = v));
    }
    for (let c = 0; c < width; c++) {
      const col = grid.map((row) => row[c]);
      lock(col, colClues[c], height, (r, v) => (grid[r][c] = v));
    }
  }
  return grid;
}

describe('tutorial puzzle', () => {
  it('has clues that match its solution', () => {
    expect(generateRowClues(TUTORIAL_PUZZLE.solution)).toEqual(TUTORIAL_PUZZLE.rowClues);
    expect(generateColClues(TUTORIAL_PUZZLE.solution)).toEqual(TUTORIAL_PUZZLE.colClues);
  });

  it('is solvable by logic alone (exactly one solution)', () => {
    expect(countSolutions(TUTORIAL_PUZZLE.rowClues, TUTORIAL_PUZZLE.colClues)).toBe(1);
  });

  it('is not a duplicate of any shipped puzzle', () => {
    const target = JSON.stringify(TUTORIAL_PUZZLE.solution);
    const dupe = ALL_PUZZLES.find((p) => JSON.stringify(p.solution) === target);
    expect(dupe, `matches shipped puzzle "${dupe?.name}"`).toBeUndefined();
  });

  it('has a color for every cell of the reveal', () => {
    const { colorSolution, width, height } = TUTORIAL_PUZZLE;
    expect(colorSolution).toBeDefined();
    expect(colorSolution).toHaveLength(height);
    for (const row of colorSolution!) {
      expect(row).toHaveLength(width);
      for (const color of row) expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

describe('tutorial steps', () => {
  const { solution, width, height } = TUTORIAL_PUZZLE;

  it('only fill cells that are filled in the solution', () => {
    for (const step of TUTORIAL_STEPS) {
      for (const [r, c] of step.fills) {
        expect(solution[r][c], `fill at ${r},${c} in "${step.title}"`).toBe(1);
      }
    }
  });

  it('only cross cells that are empty in the solution', () => {
    for (const step of TUTORIAL_STEPS) {
      for (const [r, c] of step.crosses) {
        expect(solution[r][c], `cross at ${r},${c} in "${step.title}"`).toBe(0);
      }
    }
  });

  it('cover every cell exactly once across all steps', () => {
    const seen = new Set<string>();
    let fillCount = 0;
    let crossCount = 0;
    for (const step of TUTORIAL_STEPS) {
      for (const [r, c] of [...step.fills, ...step.crosses]) {
        const key = `${r}-${c}`;
        expect(seen.has(key), `cell ${key} acted on more than once`).toBe(false);
        seen.add(key);
      }
      fillCount += step.fills.length;
      crossCount += step.crosses.length;
    }

    const totalFilled = solution.flat().filter((v) => v === 1).length;
    expect(fillCount).toBe(totalFilled);
    expect(crossCount).toBe(width * height - totalFilled);
    expect(seen.size).toBe(width * height);
  });

  it('reference only cells and clue lines inside the grid', () => {
    for (const step of TUTORIAL_STEPS) {
      for (const [r, c] of [...step.fills, ...step.crosses]) {
        expect(r, `row of ${r},${c}`).toBeGreaterThanOrEqual(0);
        expect(r, `row of ${r},${c}`).toBeLessThan(height);
        expect(c, `col of ${r},${c}`).toBeGreaterThanOrEqual(0);
        expect(c, `col of ${r},${c}`).toBeLessThan(width);
      }
      for (const r of step.highlightRows ?? []) {
        expect(r).toBeGreaterThanOrEqual(0);
        expect(r).toBeLessThan(height);
      }
      for (const c of step.highlightCols ?? []) {
        expect(c).toBeGreaterThanOrEqual(0);
        expect(c).toBeLessThan(width);
      }
    }
  });

  it('open with a no-action intro, then an actionable step with text each time', () => {
    expect(TUTORIAL_STEPS[0].fills).toHaveLength(0);
    expect(TUTORIAL_STEPS[0].crosses).toHaveLength(0);
    for (let k = 1; k < TUTORIAL_STEPS.length; k++) {
      const step = TUTORIAL_STEPS[k];
      expect(step.fills.length + step.crosses.length, `step ${k} has no cells`).toBeGreaterThan(0);
      expect(step.technique.length, `step ${k} technique`).toBeGreaterThan(0);
      expect(step.title.length, `step ${k} title`).toBeGreaterThan(0);
      expect(step.body.length, `step ${k} body`).toBeGreaterThan(0);
    }
  });

  it('never require a guess: each step only reveals cells logic already forces', () => {
    const { rowClues, colClues } = TUTORIAL_PUZZLE;
    // Cells known so far, seeded with the prior steps (intro reveals nothing).
    const known: number[][] = Array.from({ length: height }, () => Array(width).fill(-1));

    for (let k = 1; k < TUTORIAL_STEPS.length; k++) {
      const determined = forcedCells(rowClues, colClues, width, height, known);
      const step = TUTORIAL_STEPS[k];
      for (const [r, c] of step.fills) {
        expect(
          determined[r][c],
          `fill ${r},${c} in step ${k} ("${step.title}") is not forced yet`
        ).toBe(1);
      }
      for (const [r, c] of step.crosses) {
        expect(
          determined[r][c],
          `cross ${r},${c} in step ${k} ("${step.title}") is not forced yet`
        ).toBe(0);
      }
      // Apply this step before checking the next one.
      for (const [r, c] of step.fills) known[r][c] = 1;
      for (const [r, c] of step.crosses) known[r][c] = 0;
    }
  });
});
