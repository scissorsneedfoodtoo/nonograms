import { test, expect, type Locator } from '@playwright/test';
import {
  openPuzzle,
  expectNoPageScroll,
  CAT_INDEX,
  ROCKET_INDEX,
  firstEmptyCell,
  firstFilledCell,
} from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

async function boardScrollSize(board: Locator) {
  return board.evaluate((el) => ({
    scrollW: el.scrollWidth,
    clientW: el.clientWidth,
    scrollH: el.scrollHeight,
    clientH: el.clientHeight,
  }));
}

test('5x5 fits the iPhone SE width with no scrolling', async ({ page }) => {
  await openPuzzle(page, CAT_INDEX);
  await expectNoPageScroll(page);

  const board = page.locator('.nonogram-board');
  const { scrollW, clientW } = await boardScrollSize(board);
  expect(scrollW).toBe(clientW); // board itself does not scroll
});

test('10x10 scrolls inside the board, not the page', async ({ page }) => {
  await openPuzzle(page, ROCKET_INDEX);
  await expectNoPageScroll(page);

  const board = page.locator('.nonogram-board');
  const { scrollW, clientW } = await boardScrollSize(board);
  expect(scrollW).toBeGreaterThan(clientW); // board scrolls internally
});

test('cells stay finger-sized on mobile', async ({ page }) => {
  await openPuzzle(page, ROCKET_INDEX);
  const cellBox = await page.locator('.cell-0-0').boundingBox();
  expect(cellBox!.width).toBeGreaterThanOrEqual(40);
});

test('row clues stay pinned while scrolling horizontally', async ({ page }) => {
  await openPuzzle(page, ROCKET_INDEX);
  const board = page.locator('.nonogram-board');
  const rowClues = page.locator('.row-clues');
  const cell = page.locator('.cell-0-9'); // far-right column

  const rowCluesBefore = (await rowClues.boundingBox())!.x;
  const cellBefore = (await cell.boundingBox())!.x;

  await board.evaluate((el) => (el.scrollLeft = el.scrollWidth));
  await expect.poll(() => board.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);

  const rowCluesAfter = (await rowClues.boundingBox())!.x;
  const cellAfter = (await cell.boundingBox())!.x;

  expect(Math.abs(rowCluesAfter - rowCluesBefore)).toBeLessThanOrEqual(1); // pinned
  expect(cellAfter).toBeLessThan(cellBefore); // grid actually moved
});

test('column clues stay pinned while scrolling vertically', async ({ page }) => {
  await openPuzzle(page, ROCKET_INDEX);
  const board = page.locator('.nonogram-board');
  const colClues = page.locator('.col-clues');
  const cell = page.locator('.cell-9-0'); // bottom row

  const colCluesBefore = (await colClues.boundingBox())!.y;
  const cellBefore = (await cell.boundingBox())!.y;

  await board.evaluate((el) => (el.scrollTop = el.scrollHeight));
  await expect.poll(() => board.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);

  const colCluesAfter = (await colClues.boundingBox())!.y;
  const cellAfter = (await cell.boundingBox())!.y;

  expect(Math.abs(colCluesAfter - colCluesBefore)).toBeLessThanOrEqual(1); // pinned
  expect(cellAfter).toBeLessThan(cellBefore); // grid actually moved
});

test('frozen clues render above the grid cells', async ({ page }) => {
  await openPuzzle(page, ROCKET_INDEX);
  const zIndexes = await page.evaluate(() => {
    const z = (el: Element | null) => parseInt(getComputedStyle(el!).zIndex) || 0;
    const cellZ = [...document.querySelectorAll('.cell')].map((c) => z(c));
    return {
      maxCell: Math.max(...cellZ),
      rowClues: z(document.querySelector('.row-clues')),
      colClues: z(document.querySelector('.col-clues')),
      corner: z(document.querySelector('.corner')),
    };
  });
  expect(zIndexes.rowClues).toBeGreaterThan(zIndexes.maxCell);
  expect(zIndexes.colClues).toBeGreaterThan(zIndexes.maxCell);
  expect(zIndexes.corner).toBeGreaterThanOrEqual(zIndexes.rowClues);
});

test('Fill / Mark toggle lets touch users both fill and mark', async ({ page }) => {
  await openPuzzle(page, CAT_INDEX);

  // Default Fill mode: tapping a solution cell fills it.
  const [fr, fc] = firstFilledCell(CAT_INDEX);
  await page.locator(`.cell-${fr}-${fc}`).click();
  await expect(page.locator(`.cell-${fr}-${fc}`)).toHaveClass(/filled/);

  // Switch to Mark mode: tapping an empty-solution cell marks it (no mistake).
  await page.getByRole('button', { name: 'Mark' }).click();
  const [er, ec] = firstEmptyCell(CAT_INDEX);
  await page.locator(`.cell-${er}-${ec}`).click();
  await expect(page.locator(`.cell-${er}-${ec}`)).toHaveClass(/marked/);
});
