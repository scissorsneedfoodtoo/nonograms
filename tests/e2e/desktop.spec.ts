import { test, expect } from '@playwright/test';
import { openPuzzle, CAT_INDEX, firstEmptyCell, puzzleAt } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('arrow keys move focus around the grid', async ({ page }) => {
  await openPuzzle(page, CAT_INDEX);

  // Focus (not click — clicking would fill) the top-left cell, then navigate.
  await page.locator('.cell-0-0').focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowDown');

  await expect(page.locator('.cell-1-1')).toBeFocused();
});

test('Space fills and X marks via the keyboard', async ({ page }) => {
  await openPuzzle(page, CAT_INDEX);
  const [er, ec] = firstEmptyCell(CAT_INDEX);

  // X on an empty-solution cell marks it (correct move, no penalty).
  await page.locator(`.cell-${er}-${ec}`).focus();
  await page.keyboard.press('x');
  await expect(page.locator(`.cell-${er}-${ec}`)).toHaveClass(/marked/);
});

test('holding Space and moving with arrow keys paints a run of fills', async ({ page }) => {
  await openPuzzle(page, CAT_INDEX);
  const puzzle = puzzleAt(CAT_INDEX);
  const row = puzzle.solution.findIndex((r) => r.every((cell) => cell === 1));

  await page.locator(`.cell-${row}-0`).focus();
  await page.keyboard.down(' ');
  for (let c = 1; c < puzzle.width; c++) {
    await page.keyboard.press('ArrowRight');
  }
  await page.keyboard.up(' ');

  for (let c = 0; c < puzzle.width; c++) {
    await expect(page.locator(`.cell-${row}-${c}`)).toHaveClass(/filled/);
  }
});

test('holding X and moving with arrow keys paints a run of marks', async ({ page }) => {
  await openPuzzle(page, CAT_INDEX);
  const [er, ec] = firstEmptyCell(CAT_INDEX);

  await page.locator(`.cell-${er}-${ec}`).focus();
  await page.keyboard.down('x');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.up('x');

  await expect(page.locator(`.cell-${er}-${ec}`)).toHaveClass(/marked/);
  await expect(page.locator(`.cell-${er}-${ec + 1}`)).toHaveClass(/marked/);
});

test('releasing the paint key stops the run', async ({ page }) => {
  await openPuzzle(page, CAT_INDEX);
  const puzzle = puzzleAt(CAT_INDEX);
  const row = puzzle.solution.findIndex((r) => r.every((cell) => cell === 1));

  await page.locator(`.cell-${row}-0`).focus();
  await page.keyboard.down(' ');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.up(' ');
  await page.keyboard.press('ArrowRight'); // just navigation now, no held key

  await expect(page.locator(`.cell-${row}-0`)).toHaveClass(/filled/);
  await expect(page.locator(`.cell-${row}-1`)).toHaveClass(/filled/);
  await expect(page.locator(`.cell-${row}-2`)).not.toHaveClass(/filled/);
});

test('right-click and shift-click mark cells', async ({ page }) => {
  await openPuzzle(page, CAT_INDEX);
  const [er, ec] = firstEmptyCell(CAT_INDEX);

  // Right-click marks.
  await page.locator(`.cell-${er}-${ec}`).click({ button: 'right' });
  await expect(page.locator(`.cell-${er}-${ec}`)).toHaveClass(/marked/);

  // Shift-click toggles the mark back off.
  await page.locator(`.cell-${er}-${ec}`).click({ modifiers: ['Shift'] });
  await expect(page.locator(`.cell-${er}-${ec}`)).not.toHaveClass(/marked/);
});
