import { test, expect } from '@playwright/test';
import { openPuzzle, solvePuzzle, firstEmptyCell, puzzleAt, CAT_INDEX } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('grid ARIA structure', () => {
  test('exposes a conforming grid/row/gridcell tree', async ({ page }) => {
    await openPuzzle(page, CAT_INDEX);
    const puzzle = puzzleAt(CAT_INDEX);

    await expect(page.getByRole('grid')).toBeVisible();
    await expect(page.getByRole('row')).toHaveCount(puzzle.height);
    await expect(page.getByRole('gridcell')).toHaveCount(puzzle.width * puzzle.height);
  });

  test('associates each cell with its row and column clues', async ({ page }) => {
    await openPuzzle(page, CAT_INDEX);

    await expect(page.locator('.cell-0-0')).toHaveAttribute(
      'aria-describedby',
      'row-clue-0 col-clue-0',
    );
    await expect(page.locator('#row-clue-0')).toHaveCount(1);
    await expect(page.locator('#col-clue-0')).toHaveCount(1);
  });
});

test.describe('roving tabindex', () => {
  test('keeps the grid to a single tab stop that follows arrow keys', async ({ page }) => {
    await openPuzzle(page, CAT_INDEX);

    // Exactly one cell is tabbable, and it starts at the top-left.
    await expect(page.locator('.grid [role="gridcell"][tabindex="0"]')).toHaveCount(1);
    await expect(page.locator('.cell-0-0')).toHaveAttribute('tabindex', '0');

    // Arrow navigation moves the roving tab stop.
    await page.locator('.cell-0-0').focus();
    await page.keyboard.press('ArrowRight');

    await expect(page.locator('.cell-0-1')).toHaveAttribute('tabindex', '0');
    await expect(page.locator('.cell-0-0')).toHaveAttribute('tabindex', '-1');
    await expect(page.locator('.grid [role="gridcell"][tabindex="0"]')).toHaveCount(1);
  });

  test('locked cells stay focusable via aria-disabled (not disabled)', async ({ page }) => {
    await openPuzzle(page, CAT_INDEX);
    const [er, ec] = firstEmptyCell(CAT_INDEX);
    const cell = page.locator(`.cell-${er}-${ec}`);

    await cell.click(); // mistake -> auto-corrected, locked
    await expect(cell).toHaveAttribute('aria-disabled', 'true');
    await expect(cell).not.toHaveAttribute('disabled', '');
  });
});

test.describe('focus management and titles on view transitions', () => {
  test('entering a puzzle focuses the game heading and sets the title', async ({ page }) => {
    await openPuzzle(page, CAT_INDEX);

    await expect(page.locator('.header-nav h1')).toBeFocused();
    await expect(page).toHaveTitle('Puzzle #1 — Nonograms');
  });

  test('exiting returns focus to the originating card and resets the title', async ({ page }) => {
    await openPuzzle(page, CAT_INDEX);
    await page.getByRole('button', { name: 'Exit to Menu', exact: true }).click();

    await expect(page.locator('.puzzle-square[data-order="1"]')).toBeFocused();
    await expect(page).toHaveTitle('Nonograms');
  });
});

test.describe('confirm dialog', () => {
  test('moves focus in, traps Tab, and restores focus on Escape', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Reset All Progress' });
    await trigger.click();

    const confirm = page.getByRole('button', { name: 'Yes, Reset Everything' });
    const cancel = page.getByRole('button', { name: 'Cancel' });

    // Initial focus lands inside the dialog.
    await expect(confirm).toBeFocused();

    // The background is inert while the dialog is open.
    await expect(page.locator('.level-select-container')).toHaveJSProperty('inert', true);

    // Focus is trapped: tabbing past either edge wraps within the dialog. (The
    // trap drives this with an explicit focus() call, so it's engine-agnostic —
    // WebKit otherwise skips buttons when tabbing.)
    await page.keyboard.press('Shift+Tab');
    await expect(cancel).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(confirm).toBeFocused();

    // Escape closes it and returns focus to the trigger; background is live again.
    await page.keyboard.press('Escape');
    await expect(confirm).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(page.locator('.level-select-container')).toHaveJSProperty('inert', false);
  });
});

test.describe('win dialog', () => {
  test('makes the board inert, focuses the dialog, and returns focus on close', async ({
    page,
  }) => {
    await openPuzzle(page, CAT_INDEX);
    await solvePuzzle(page, CAT_INDEX);

    const back = page.getByRole('button', { name: 'Back to Levels' });

    // Initial focus lands inside the dialog; the board behind it is inert.
    await expect(back).toBeFocused();
    await expect(page.locator('.game-container')).toHaveJSProperty('inert', true);

    // Escape closes it, returns to the menu, and focuses the originating card.
    await page.keyboard.press('Escape');
    await expect(page.locator('.puzzle-square[data-order="1"]')).toBeFocused();
    await expect(page).toHaveTitle('Nonograms');
  });
});

test.describe('announcements and decorative content', () => {
  test('announces incorrect moves in an assertive live region', async ({ page }) => {
    await openPuzzle(page, CAT_INDEX);
    const [er, ec] = firstEmptyCell(CAT_INDEX);

    const live = page.locator('[role="status"]');
    await expect(live).toHaveAttribute('aria-live', 'assertive');

    await page.locator(`.cell-${er}-${ec}`).click();
    await expect(live).toContainText('Incorrect move');
  });

  test('hides decorative glyphs from the accessible name', async ({ page }) => {
    await openPuzzle(page, CAT_INDEX);

    // Back-button arrow is hidden, so the name is exactly the label.
    await expect(page.getByRole('button', { name: 'Exit to Menu', exact: true })).toBeVisible();

    // Win emoji is hidden from the heading name.
    await solvePuzzle(page, CAT_INDEX);
    await expect(
      page.getByRole('heading', { name: 'Puzzle Completed!', exact: true }),
    ).toBeVisible();
  });

  test('hides the preview image from assistive tech', async ({ page }) => {
    await expect(page.locator('.preview-container').first()).toHaveAttribute('aria-hidden', 'true');
  });

  test('marks the pagination indicator as a polite live region', async ({ page }) => {
    await expect(page.locator('.page-indicator')).toHaveAttribute('aria-live', 'polite');
  });
});

test('honors prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const duration = await page
    .locator('.puzzle-square')
    .first()
    .evaluate((el) => {
      return getComputedStyle(el).transitionDuration;
    });
  // Parsed in seconds; the reduce block collapses it to ~0 (0.01ms).
  expect(parseFloat(duration)).toBeLessThan(0.05);
});
