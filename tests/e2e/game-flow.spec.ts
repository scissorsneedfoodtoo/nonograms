import { test, expect } from '@playwright/test';
import { openPuzzle, CAT_INDEX, firstEmptyCell, firstEmptyCells, firstFilledCell } from './helpers';

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
  // The first mistake costs 30s; penalties escalate linearly after that.
  await expect(page.locator('.penalty-hint')).toContainText('0:30');
  // After the auto-correction it becomes a locked mark. It stays focusable
  // (aria-disabled, not disabled) so keyboard grid navigation can move past it.
  await expect(cell).toHaveClass(/locked/);
  await expect(cell).toHaveAttribute('aria-disabled', 'true');
});

test('penalties escalate: the second mistake costs more than the first', async ({ page }) => {
  await openPuzzle(page, CAT_INDEX);
  const [[r1, c1], [r2, c2]] = firstEmptyCells(CAT_INDEX, 2);

  // First wrong fill: +30s.
  await page.locator(`.cell-${r1}-${c1}`).click();
  await expect(page.locator('.error-text')).toHaveText('1');
  await expect(page.locator('.penalty-hint')).toContainText('0:30');

  // Second wrong fill adds +60s, for a running total of 1:30 (not 1:00).
  await page.locator(`.cell-${r2}-${c2}`).click();
  await expect(page.locator('.error-text')).toHaveText('2');
  await expect(page.locator('.penalty-hint')).toContainText('1:30');
});

test('marking a cell that should be filled is not a mistake', async ({ page }) => {
  await openPuzzle(page, CAT_INDEX);
  const [fr, fc] = firstFilledCell(CAT_INDEX);
  const cell = page.locator(`.cell-${fr}-${fc}`);

  // X marks are just the player's own notes, so placing one on a filled-solution
  // cell must not add a penalty or lock the cell.
  await cell.click({ button: 'right' });

  await expect(cell).toHaveClass(/marked/);
  await expect(cell).not.toHaveClass(/locked/);
  await expect(page.locator('.error-text')).toHaveText('0');
  await expect(page.locator('.penalty-hint')).toContainText('0:00');

  // And the mark stays a free, reversible note — toggling it back off is allowed.
  await cell.click({ button: 'right' });
  await expect(cell).not.toHaveClass(/marked/);
  await expect(page.locator('.error-text')).toHaveText('0');
});

test('the mistake counter only reacts to wrong fills, not X marks', async ({ page }) => {
  await openPuzzle(page, CAT_INDEX);
  const [fr, fc] = firstFilledCell(CAT_INDEX);
  const [er, ec] = firstEmptyCell(CAT_INDEX);

  // Marking a filled-solution cell: no penalty.
  await page.locator(`.cell-${fr}-${fc}`).click({ button: 'right' });
  await expect(page.locator('.error-text')).toHaveText('0');

  // Filling an empty-solution cell: a penalty.
  await page.locator(`.cell-${er}-${ec}`).click();
  await expect(page.locator('.error-text')).toHaveText('1');
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
