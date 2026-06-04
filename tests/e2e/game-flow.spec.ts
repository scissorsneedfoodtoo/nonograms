import { test, expect } from '@playwright/test';
import { openPuzzle, CAT_INDEX, firstEmptyCell, firstFilledCell } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('selecting a puzzle opens the board and Exit returns to the menu', async ({ page }) => {
  await openPuzzle(page, CAT_INDEX);
  await expect(page.locator('.nonogram-board')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('#1');

  await page.getByRole('button', { name: 'Exit to Menu' }).click();
  await expect(page.locator('.puzzle-grid')).toBeVisible();
});

test('pagination moves between pages of puzzles', async ({ page }) => {
  await expect(page.locator('.page-indicator')).toHaveText('Page 1 / 2');
  await expect(page.locator('.puzzle-square').first().locator('.puzzle-size')).toHaveText('5x5');

  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('.page-indicator')).toHaveText('Page 2 / 2');
  await expect(page.locator('.puzzle-square').first().locator('.puzzle-size')).toHaveText('10x10');

  await page.getByRole('button', { name: 'Prev' }).click();
  await expect(page.locator('.page-indicator')).toHaveText('Page 1 / 2');
});

test('a wrong move adds a penalty and locks the cell', async ({ page }) => {
  await openPuzzle(page, CAT_INDEX);
  const [er, ec] = firstEmptyCell(CAT_INDEX);
  const cell = page.locator(`.cell-${er}-${ec}`);

  // Filling an empty-solution cell is a mistake.
  await cell.click();

  await expect(page.locator('.error-text')).toHaveText('1');
  await expect(page.locator('.penalty-hint')).toContainText('0:15');
  // After the auto-correction it becomes a locked, disabled mark.
  await expect(cell).toHaveClass(/locked/);
  await expect(cell).toBeDisabled();
});

test('progress is saved on exit and restored on return', async ({ page }) => {
  await openPuzzle(page, CAT_INDEX);
  const [fr, fc] = firstFilledCell(CAT_INDEX);
  await page.locator(`.cell-${fr}-${fc}`).click();
  await expect(page.locator(`.cell-${fr}-${fc}`)).toHaveClass(/filled/);

  await page.getByRole('button', { name: 'Exit to Menu' }).click();
  await expect(page.locator('.puzzle-square').first().locator('.status-hint')).toHaveText(
    'In Progress'
  );

  await openPuzzle(page, CAT_INDEX);
  await expect(page.locator(`.cell-${fr}-${fc}`)).toHaveClass(/filled/);
});

test('Reset Puzzle clears the board', async ({ page }) => {
  await openPuzzle(page, CAT_INDEX);
  const [fr, fc] = firstFilledCell(CAT_INDEX);
  const cell = page.locator(`.cell-${fr}-${fc}`);
  await cell.click();
  await expect(cell).toHaveClass(/filled/);

  await page.getByRole('button', { name: 'Reset Puzzle' }).click();
  await expect(cell).not.toHaveClass(/filled/);
});
