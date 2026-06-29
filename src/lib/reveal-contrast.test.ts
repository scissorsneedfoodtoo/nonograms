import { describe, it, expect } from 'vitest';
import { ALL_PUZZLES } from './puzzles';
import { findIndistinguishableAdjacencies } from './contrast';

/**
 * Reveal-art contrast standard: adjacent regions in a completed puzzle's
 * `colorSolution` should be visually distinct. A pair of differently-colored
 * orthogonal neighbours passes if it clears EITHER the lightness path
 * (WCAG non-text contrast >= 3:1) or the hue path (CIELAB a*,b* distance >= 25).
 * Both thresholds live in ./contrast (MIN_REVEAL_CONTRAST / MIN_REVEAL_CHROMA).
 *
 * NEW puzzles must pass. Many older puzzles predate this standard and are listed
 * in KNOWN_REVEAL_CONTRAST_FAILURES below; they'll be recolored in a follow-up
 * PR. The allowlist is self-cleaning: a listed puzzle that no longer fails makes
 * the suite fail, prompting you to delete its id.
 */
const KNOWN_REVEAL_CONTRAST_FAILURES = new Set<string>([
  '3a7f', // Cat
  'b2d4', // Heart
  '9e1c', // Apple
  'f45a', // Tree
  'e6a1', // Diamond
  'd4c2', // Boat
  'c91b', // Coffee Mug
  '6f3e', // Rocket
  'e8a3', // Crown
  '3d7f', // Pizza Slice
  '9c2b', // Penguin
  'f1e6', // Butterfly
  '7a4d', // Trophy
  '2c9e', // Campfire
  'a3c9', // Snail
  '4d8a', // Alien
  'b5f3', // Whale
  'a9f4', // Fox
  'b7e2', // Ice Cream
  'd1a7', // Crane Game
]);

describe('puzzle reveal-art contrast', () => {
  it('only allowlists puzzles that actually exist', () => {
    const ids = new Set(ALL_PUZZLES.map((p) => p.id));
    for (const id of KNOWN_REVEAL_CONTRAST_FAILURES) {
      expect(ids.has(id), `Allowlisted id "${id}" matches no puzzle`).toBe(true);
    }
  });

  ALL_PUZZLES.forEach((puzzle) => {
    const allowed = KNOWN_REVEAL_CONTRAST_FAILURES.has(puzzle.id);

    it(`${puzzle.name} (id: ${puzzle.id}) ${allowed ? 'is a known failure (allowlisted)' : 'has distinguishable adjacent reveal colors'}`, () => {
      if (!puzzle.colorSolution) return;
      const issues = findIndistinguishableAdjacencies(puzzle.colorSolution);

      if (allowed) {
        // Self-cleaning: once a puzzle is recolored to pass, remove its id above.
        expect(
          issues.length,
          `Puzzle "${puzzle.name}" (${puzzle.id}) now passes — remove it from KNOWN_REVEAL_CONTRAST_FAILURES`,
        ).toBeGreaterThan(0);
        return;
      }

      const detail = issues
        .slice(0, 5)
        .map(
          (i) =>
            `  (${i.row},${i.col}) ${i.a} vs (${i.neighborRow},${i.neighborCol}) ${i.b} ` +
            `— contrast ${i.contrast.toFixed(2)}:1, chroma ${i.chroma.toFixed(0)}`,
        )
        .join('\n');
      expect(
        issues.length,
        `Puzzle "${puzzle.name}" has ${issues.length} indistinguishable adjacent reveal color pair(s):\n${detail}`,
      ).toBe(0);
    });
  });
});
