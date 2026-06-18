import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openPuzzle, solvePuzzle, CAT_INDEX } from './helpers';

// WCAG A/AA across 2.0, 2.1, and 2.2 — the levels this project targets.
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// Derived from AxeBuilder so we don't depend on axe-core's types directly.
type Violation = Awaited<ReturnType<InstanceType<typeof AxeBuilder>['analyze']>>['violations'][number];

function summarize(violations: Violation[]): string {
  if (violations.length === 0) return 'no violations';
  return violations
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)
    .join('\n');
}

async function scan(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(results.violations, summarize(results.violations)).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('level-select screen has no automatically detectable a11y violations', async ({ page }) => {
  await scan(page);
});

test('game board has no automatically detectable a11y violations', async ({ page }) => {
  await openPuzzle(page, CAT_INDEX);
  await scan(page);
});

test('tutorial has no automatically detectable a11y violations', async ({ page }) => {
  await page.getByRole('button', { name: 'How to Play' }).click();
  await expect(page.getByRole('heading', { name: 'How to Play' })).toBeVisible();
  await scan(page);
});

test('confirm dialog has no automatically detectable a11y violations', async ({ page }) => {
  await page.getByRole('button', { name: 'Reset All Progress' }).click();
  await expect(page.getByRole('button', { name: 'Yes, Reset Everything' })).toBeFocused();
  await scan(page);
});

test('win dialog has no automatically detectable a11y violations', async ({ page }) => {
  await openPuzzle(page, CAT_INDEX);
  await solvePuzzle(page, CAT_INDEX);
  await expect(page.getByRole('button', { name: 'Back to Levels' })).toBeFocused();
  await scan(page);
});
