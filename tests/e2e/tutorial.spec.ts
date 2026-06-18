import { test, expect } from '@playwright/test';
import { TUTORIAL_STEPS } from '../../src/lib/tutorial';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('How to Play opens the tutorial and Exit returns to the menu', async ({ page }) => {
  await page.getByRole('button', { name: 'How to Play' }).click();
  await expect(page.getByRole('heading', { name: 'How to Play' })).toBeVisible();

  await page.getByRole('button', { name: 'Exit to Menu' }).click();
  await expect(page.locator('.puzzle-grid')).toBeVisible();
});

test('clicking a highlighted cell performs the step', async ({ page }) => {
  await page.getByRole('button', { name: 'How to Play' }).click();

  // Advance past the intro into the first interactive step.
  await page.getByRole('button', { name: /Next/ }).click();

  // Next is disabled until every one of the step's cells is acted on.
  const next = page.getByRole('button', { name: /Next/ });
  await expect(next).toBeDisabled();

  // Click each highlighted cell (fills and crosses alike); Next then unlocks.
  const step = TUTORIAL_STEPS[1];
  for (const [r, c] of [...step.fills, ...step.crosses]) {
    await page.locator(`[data-cell="${r}-${c}"]`).click();
  }
  await expect(next).toBeEnabled();
});

test('Back clears the current step so it can be redone', async ({ page }) => {
  await page.getByRole('button', { name: 'How to Play' }).click();

  await page.getByRole('button', { name: /Next/ }).click(); // intro -> step 1
  await page.getByRole('button', { name: 'Show me' }).click(); // perform step 1
  await expect(page.locator('[data-cell="2-0"]')).toHaveClass(/filled/);
  await page.getByRole('button', { name: /Next/ }).click(); // -> step 2
  await expect(page.locator('.progress')).toContainText('Step 3 of');

  await page.getByRole('button', { name: /Back/ }).click(); // back to step 1
  await expect(page.locator('.progress')).toContainText('Step 2 of');
  // The step's cells are reset so the player can perform it again.
  await expect(page.locator('[data-cell="2-0"]')).not.toHaveClass(/filled/);
});

test('finishing reveals the colored picture', async ({ page }) => {
  await page.getByRole('button', { name: 'How to Play' }).click();
  for (let i = 0; i < TUTORIAL_STEPS.length; i++) {
    const showMe = page.getByRole('button', { name: 'Show me' });
    if (await showMe.isVisible()) await showMe.click();
    await page.getByRole('button', { name: /Next|Finish/ }).click();
  }

  await expect(page.getByText(/It's a Cardinal/)).toBeVisible();
  // The beak is painted with its colorSolution color (#f39c12)...
  await expect(page.locator('[data-cell="2-2"]')).toHaveCSS('background-color', 'rgb(243, 156, 18)');
  // ...and the X marks are hidden in favor of the picture.
  await expect(page.locator('[data-cell="0-0"]')).not.toContainText('×');
});

test('stepping through with “Show me” solves the puzzle', async ({ page }) => {
  await page.getByRole('button', { name: 'How to Play' }).click();

  // Walk every step: use "Show me" where the step has cells, then advance.
  for (let i = 0; i < TUTORIAL_STEPS.length; i++) {
    const showMe = page.getByRole('button', { name: 'Show me' });
    if (await showMe.isVisible()) {
      await showMe.click();
    }
    await page.getByRole('button', { name: /Next|Finish/ }).click();
  }

  await expect(page.getByRole('heading', { name: /You solved it/ })).toBeVisible();

  // The board is fully solved: every cell is filled or marked, none left empty.
  await expect(page.locator('.cell.empty')).toHaveCount(0);

  await page.getByRole('button', { name: 'Back to puzzles' }).click();
  await expect(page.locator('.puzzle-grid')).toBeVisible();
});
