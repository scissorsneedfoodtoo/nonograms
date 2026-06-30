import { type Page, expect } from '@playwright/test';
import { ALL_PUZZLES } from '../../src/lib/puzzles';

export const PUZZLES_PER_PAGE = 12;

/** Total number of level-select pages, derived the same way the app does. */
export const TOTAL_PAGES = Math.ceil(ALL_PUZZLES.length / PUZZLES_PER_PAGE);

/** Index of the first 5x5 and first 10x10 puzzle in the level-select order. */
export const CAT_INDEX = 0; // 5x5
export const ROCKET_INDEX = 12; // 10x10 (first puzzle on page 2)

export function puzzleAt(index: number) {
  return ALL_PUZZLES[index];
}

/** Size label as rendered on a puzzle card, e.g. "5x5". */
export function puzzleSize(index: number): string {
  const puzzle = puzzleAt(index);
  return `${puzzle.width}x${puzzle.height}`;
}

/** Navigate from the level-select screen into the puzzle at the given index. */
export async function openPuzzle(page: Page, index: number) {
  const targetPage = Math.floor(index / PUZZLES_PER_PAGE);
  for (let i = 0; i < targetPage; i++) {
    await page.getByRole('button', { name: 'Next' }).click();
  }
  await page
    .locator('.puzzle-square')
    .nth(index % PUZZLES_PER_PAGE)
    .click();
  await page.waitForSelector('.nonogram-board');
}

/** Fill every solution cell (in the default Fill mode), which wins the puzzle. */
export async function solvePuzzle(page: Page, index: number) {
  const puzzle = puzzleAt(index);
  for (let r = 0; r < puzzle.height; r++) {
    for (let c = 0; c < puzzle.width; c++) {
      if (puzzle.solution[r][c] === 1) {
        await page.locator(`.cell-${r}-${c}`).click();
      }
    }
  }
}

/** First cell that is empty in the solution (clicking it in Fill mode is a mistake). */
export function firstEmptyCell(index: number): [number, number] {
  const puzzle = puzzleAt(index);
  for (let r = 0; r < puzzle.height; r++) {
    for (let c = 0; c < puzzle.width; c++) {
      if (puzzle.solution[r][c] === 0) return [r, c];
    }
  }
  throw new Error('puzzle has no empty cell');
}

/** First `count` cells that are empty in the solution (each a mistake in Fill mode). */
export function firstEmptyCells(index: number, count: number): [number, number][] {
  const puzzle = puzzleAt(index);
  const cells: [number, number][] = [];
  for (let r = 0; r < puzzle.height; r++) {
    for (let c = 0; c < puzzle.width; c++) {
      if (puzzle.solution[r][c] === 0) {
        cells.push([r, c]);
        if (cells.length === count) return cells;
      }
    }
  }
  throw new Error(`puzzle has fewer than ${count} empty cells`);
}

/** First cell that is filled in the solution. */
export function firstFilledCell(index: number): [number, number] {
  const puzzle = puzzleAt(index);
  for (let r = 0; r < puzzle.height; r++) {
    for (let c = 0; c < puzzle.width; c++) {
      if (puzzle.solution[r][c] === 1) return [r, c];
    }
  }
  throw new Error('puzzle has no filled cell');
}

/** Horizontal overflow of the whole document (0 means no page-level scroll). */
export async function pageOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

export async function expectNoPageScroll(page: Page) {
  expect(await pageOverflow(page)).toBe(0);
}
