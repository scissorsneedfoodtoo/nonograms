import type { Puzzle } from './types';

/**
 * A dedicated 5x5 puzzle used only by the interactive tutorial. It is NOT part
 * of ALL_PUZZLES, so walking through it here never spoils a real puzzle, and its
 * shape is distinct from every shipped puzzle (checked in tutorial.test.ts).
 *
 * A cardinal seen head-on: a pointed crest, spread wings (the full middle row),
 * a red body, and two feet. The shape is symmetric and every row and column has
 * at least one filled cell (no 0 clues). Uniqueness was verified with
 * countSolutions().
 *
 * The clues drive a single, guess-free path that demonstrates each core
 * technique once: full lines, overlapping (simple boxes), crosses, splitting,
 * and joining.
 *
 *   . . # . .   row [1]    crest
 *   . # # # .   row [3]    head
 *   # # # # #   row [5]    spread wings
 *   . # # # .   row [3]    body
 *   . # . # .   row [1,1]  feet
 */
const SKY = '#aed9e0';
const RED = '#c0392b';
const FACE = '#1a1a1a';
const BEAK = '#f39c12';
const LEGS = '#4a3528';

export const TUTORIAL_PUZZLE: Puzzle = {
  id: 'tutorial',
  name: 'Cardinal',
  width: 5,
  height: 5,
  solution: [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0]
  ],
  colorSolution: [
    [SKY, SKY, RED, SKY, SKY],
    [SKY, RED, FACE, RED, SKY],
    [RED, RED, BEAK, RED, RED],
    [SKY, RED, RED, RED, SKY],
    [SKY, LEGS, SKY, LEGS, SKY]
  ],
  rowClues: [[1], [3], [5], [3], [1, 1]],
  colClues: [[1], [4], [4], [4], [1]]
};

export type Cell = [row: number, col: number];

export interface TutorialStep {
  /** Short badge shown above the step, e.g. the technique name. */
  technique: string;
  title: string;
  /** Explanation shown in the step panel. Stylized text. */
  body: string[];
  /** Cells the player fills in this step (become 'filled'). */
  fills: Cell[];
  /** Cells the player marks with an X in this step (become 'marked'). */
  crosses: Cell[];
  /**
   * When true, the step is complete as soon as its `fills` are placed; the
   * `crosses` become optional X marks (the player may add them but doesn't have
   * to). Used for the final step so it ends like the real game — the puzzle is
   * won the moment the last image cell is filled.
   */
  completeOnFill?: boolean;
  /** An illustrative diagram to render alongside the body text, if any. */
  diagram?: 'overlap';
  /** Row/column clue indices to emphasize while this step is active. */
  highlightRows?: number[];
  highlightCols?: number[];
}

/**
 * Ordered teaching steps. Every fill/cross cell matches TUTORIAL_PUZZLE.solution,
 * and together the steps fill all 14 filled cells and cross all 11 empty cells —
 * see tutorial.test.ts, which enforces both invariants.
 */
export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    technique: 'The basics',
    title: 'How To Read the Clues',
    body: [
      'Each number represents the length of a run of filled cells, in order from left to right (rows) or top to bottom (columns).',
      'Runs in the same row or column are always separated by at least one empty cell. For example, a clue of <pre>[3 2]</pre> means three filled cells, then at least one empty cell, then two filled cells.',
      'Mark cells you know are empty with an X so you can rule them out as you go. Click "Next" to start solving.'
    ],
    fills: [],
    crosses: []
  },
  {
    technique: 'Full lines',
    title: 'Fill a Line When the Clue Matches Its Length',
    body: [
      'If a clue equals the length of its row or column, every cell in that line must be filled. Row 3 has a clue of <pre>[5]</pre> and is 5 cells wide, so all five of its cells must be filled.',
      'Fill in every cell in row 3.'
    ],
    fills: [
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 3],
      [2, 4]
    ],
    crosses: [],
    highlightRows: [2]
  },
  {
    technique: 'Overlapping',
    title: 'Overlap Reveals Guaranteed Cells',
    body: [
      'Columns 2, 3, and 4 each have a clue of <pre>[4]</pre> in a column that is 5 cells tall.',
      'Imagine sliding a block of 4 cells as far up as it can go, then as far down as it can go. Any cell covered in both positions must be filled.',
      'Row 3 is already filled, so this guarantees the middle cells in rows 2 and 4. Fill those in now.'
    ],
    fills: [
      [1, 1],
      [1, 2],
      [1, 3],
      [3, 1],
      [3, 2],
      [3, 3]
    ],
    crosses: [],
    diagram: 'overlap',
    highlightCols: [1, 2, 3]
  },
  {
    technique: 'Crosses',
    title: 'Satisfied Clues Reveal Empty Cells',
    body: [
      "Columns 1 and 5 each have a clue of <pre>[1]</pre>, and there's already a filled cell in each column. Since the clue is satisfied, every other cell in those columns must be empty.",
      "Mark the remaining cells with X's down both sides."
    ],

    fills: [],
    crosses: [
      [0, 0],
      [1, 0],
      [3, 0],
      [4, 0],
      [0, 4],
      [1, 4],
      [3, 4],
      [4, 4]
    ],
    highlightCols: [0, 4]
  },
  {
    technique: 'Splitting',
    title: 'A Gap Splits a Line Into Separate Runs',
    body: [
      'The bottom row reads <pre>[1 1]</pre>, meaning two single filled cells separated by at least one empty cell.',
      'Since the side cells are already known to be empty, the only valid positions for the two filled cells are under columns 2 and 4.',
      'Fill those two cells, and mark the gap in between as empty.'
    ],
    fills: [
      [4, 1],
      [4, 3]
    ],
    crosses: [[4, 2]],
    highlightRows: [4]
  },
  {
    technique: 'Joining',
    title: 'When One End Is Blocked, the Run Extends the Other Way',
    body: [
      'Column 3 has a clue of <pre>[4]</pre>. Three of its cells are already filled and the bottom cell is now blocked, so the last filled cell has to be at the top.',
      "Fill the top cell of column 3 — the crest. You can optionally mark the two empty cells beside it with an X, but it's not required.",
      'Filling that final cell completes the puzzle!'
    ],
    fills: [[0, 2]],
    crosses: [
      [0, 1],
      [0, 3]
    ],
    completeOnFill: true,
    highlightRows: [0],
    highlightCols: [2]
  }
];
