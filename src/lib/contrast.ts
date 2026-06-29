/**
 * Shared color-contrast math.
 *
 * Two distinct concerns share this maths — keep them straight:
 *  - ACCESSIBILITY: `contrast.test.ts` guards the app's CSS UI tokens (text on
 *    panels, gridlines) against WCAG luminance thresholds. This is real a11y —
 *    the player must perceive these to operate the game.
 *  - VISUAL QUALITY: `reveal-contrast.test.ts` guards each puzzle's `colorSolution`
 *    — the picture revealed on completion — so adjacent regions stay visually
 *    distinct. This is a polish/legibility gate, NOT accessibility: the reveal is
 *    cosmetic and post-solve, carries no text, and never affects play.
 *
 * Keeping the WCAG maths in one place means both measure contrast the same way.
 */

function parseHex(color: string): [number, number, number] {
  let hex = color.trim().replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    throw new Error(`Expected a #rrggbb (or #rgb) hex colour, got "${color}"`);
  }
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance of an `#rrggbb` (or `#rgb`) colour. */
export function luminance(color: string): number {
  const [r, g, b] = parseHex(color);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio (1–21) between two colours. */
export function contrastRatio(a: string, b: string): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/** Convert an sRGB colour to CIELAB (D65). */
function toLab(color: string): { L: number; a: number; b: number } {
  const [lr, lg, lb] = parseHex(color).map(channel);
  const Y = lr * 0.2126 + lg * 0.7152 + lb * 0.0722;
  const X = (lr * 0.4124 + lg * 0.3576 + lb * 0.1805) / 0.95047;
  const Z = (lr * 0.0193 + lg * 0.1192 + lb * 0.9505) / 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(X);
  const fy = f(Y);
  const fz = f(Z);
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

/**
 * Distance between two colours in the CIELAB a*,b* (chroma/hue) plane. This
 * captures "different colour" independently of lightness, so two equally-light
 * but clearly different hues still score high.
 */
export function chromaDistance(a: string, b: string): number {
  const A = toLab(a);
  const B = toLab(b);
  return Math.hypot(A.a - B.a, A.b - B.b);
}

/**
 * Reveal-art legibility standard (visual quality, not accessibility). Adjacent
 * regions in a completed puzzle should look distinct. We accept two paths so the
 * art is not forced to be light-on-dark:
 *  - lightness path: the WCAG non-text contrast ratio, borrowed here purely as a
 *    convenient lightness-difference metric (not an a11y claim), and
 *  - hue path: a clear difference in the a*,b* plane.
 * A pair passes if it clears either. The hue path is intentionally not
 * colourblind-safe — acceptable since the reveal is cosmetic. Starting values, tunable here.
 */
export const MIN_REVEAL_CONTRAST = 3;
export const MIN_REVEAL_CHROMA = 25;

/** Whether two adjacent reveal colours are distinguishable under the standard. */
export function areDistinguishable(
  a: string,
  b: string,
  minContrast = MIN_REVEAL_CONTRAST,
  minChroma = MIN_REVEAL_CHROMA,
): boolean {
  if (a === b) return true;
  return contrastRatio(a, b) >= minContrast || chromaDistance(a, b) >= minChroma;
}

export interface AdjacencyIssue {
  row: number;
  col: number;
  neighborRow: number;
  neighborCol: number;
  a: string;
  b: string;
  contrast: number;
  chroma: number;
}

/**
 * Every orthogonally-adjacent pair of differently-colored cells in a reveal grid
 * that is NOT distinguishable under the standard. Empty array means the reveal passes.
 */
export function findIndistinguishableAdjacencies(colorSolution: string[][]): AdjacencyIssue[] {
  const issues: AdjacencyIssue[] = [];
  const height = colorSolution.length;
  for (let r = 0; r < height; r++) {
    const width = colorSolution[r].length;
    for (let c = 0; c < width; c++) {
      const a = colorSolution[r][c];
      for (const [dr, dc] of [
        [0, 1],
        [1, 0],
      ] as const) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= height || nc >= colorSolution[nr].length) continue;
        const b = colorSolution[nr][nc];
        if (areDistinguishable(a, b)) continue;
        issues.push({
          row: r,
          col: c,
          neighborRow: nr,
          neighborCol: nc,
          a,
          b,
          contrast: contrastRatio(a, b),
          chroma: chromaDistance(a, b),
        });
      }
    }
  }
  return issues;
}
