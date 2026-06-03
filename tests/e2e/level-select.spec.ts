import { test, expect } from '@playwright/test';
import { openPuzzle, solvePuzzle, puzzleAt, CAT_INDEX } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('completing a puzzle reveals its name and records a best time', async ({ page }) => {
  await openPuzzle(page, CAT_INDEX);
  await solvePuzzle(page, CAT_INDEX);

  // Win modal.
  await expect(page.getByText('Puzzle Completed!')).toBeVisible();
  await page.getByRole('button', { name: 'Back to Levels' }).click();

  // The card now reveals the puzzle name and a best time.
  const card = page.locator('.puzzle-square').first();
  await expect(card.locator('.puzzle-name')).toHaveText(puzzleAt(CAT_INDEX).name);
  await expect(card.locator('.best-time')).toContainText('Best:');
});

test('Reset All Progress clears completed puzzles', async ({ page }) => {
  // Complete a puzzle so there is progress to clear.
  await openPuzzle(page, CAT_INDEX);
  await solvePuzzle(page, CAT_INDEX);
  await page.getByRole('button', { name: 'Back to Levels' }).click();
  const card = page.locator('.puzzle-square').first();
  await expect(card.locator('.puzzle-name')).toHaveText(puzzleAt(CAT_INDEX).name);

  // Reset everything via the confirmation modal.
  await page.getByRole('button', { name: 'Reset All Progress' }).click();
  await page.getByRole('button', { name: 'Yes, Reset Everything' }).click();

  await expect(card.locator('.puzzle-name')).toHaveText('???');
  await expect(card.locator('.status-hint')).toHaveText('Not Started');
});
