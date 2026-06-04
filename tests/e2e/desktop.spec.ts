import { test, expect } from '@playwright/test';
import { openPuzzle, CAT_INDEX, firstEmptyCell } from './helpers';

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
