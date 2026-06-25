import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

/**
 * Guards the color tokens behind the accessibility-audit contrast fixes against
 * regression. Parses the CSS custom properties straight out of app.css and
 * asserts each foreground/background pair clears its WCAG threshold, so changing
 * a token to something non-compliant fails here.
 */

const css = readFileSync(new URL('../app.css', import.meta.url), 'utf8');

const tokens: Record<string, string> = {};
for (const [, name, hex] of css.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\b/g)) {
  tokens[name] = hex;
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(fg: string, bg: string): number {
  const l1 = luminance(tokens[fg]);
  const l2 = luminance(tokens[bg]);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

const AA_TEXT = 4.5; // WCAG 1.4.3 normal-size text
const UI = 3; // WCAG 1.4.11 non-text (gridlines, separators)

// [foreground token, background token, minimum ratio, what it covers]
const pairs: Array<[string, string, number, string]> = [
  ['error-red-text', 'gray-90', AA_TEXT, 'Reset All Progress idle text/border'],
  ['cell-divider', 'gray-00', UI, 'thin gridline on empty (white) cells'],
  ['cell-divider-filled', 'gray-90', UI, 'thin gridline on filled (navy) cells'],
  ['clue-divider', 'gray-85', UI, 'clue-gutter separator lines'],
  ['gray-45', 'gray-85', AA_TEXT, 'completed clue numbers (opacity removed)'],
  ['gray-45', 'gray-90', AA_TEXT, 'page indicator / status hints / footer'],
  ['yellow-gold', 'gray-90', AA_TEXT, 'headings / active hints'],
  ['warning-orange', 'gray-85', AA_TEXT, 'mistake counter text'],
  ['gray-00', 'gray-85', AA_TEXT, 'default button text'],
  ['gray-90', 'yellow-gold', AA_TEXT, 'active mode / primary button text'],
];

describe('color token contrast', () => {
  it('defines every token referenced by the contrast checks', () => {
    for (const [fg, bg] of pairs) {
      expect(tokens[fg], `missing token --${fg}`).toBeDefined();
      expect(tokens[bg], `missing token --${bg}`).toBeDefined();
    }
  });

  it.each(pairs)('--%s on --%s clears %d:1 (%s)', (fg, bg, min) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(min);
  });
});
