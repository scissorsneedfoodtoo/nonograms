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
  /** Explanation shown in the step panel. Plain text. */
  body: string;
  /** Cells the player fills in this step (become 'filled'). */
  fills: Cell[];
  /** Cells the player marks with an X in this step (become 'marked'). */
  crosses: Cell[];
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
    title: 'How to read the clues',
    body: 'Each number is the length of a run of filled cells, in order from left-to-right (rows) or top-to-bottom (columns). Runs in the same line always have at least one empty cell between them. Mark cells you know are empty with an X so they are easy to skip. Click Next to start solving.',
    fills: [],
    crosses: []
  },
  {
    technique: 'Full lines',
    title: 'Fill a line that is completely full',
    body: 'When a clue equals the line length, every cell in that line is filled. Row 3 reads [5] in a width of 5 — fill it all the way across.',
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
    title: 'Overlap finds guaranteed cells',
    body: 'Columns 2, 3 and 4 each read [4] in a height of 5. Slide each block as far up as it goes, then as far down: the cells covered both ways are always filled. That fills the middle of rows 2 and 4.',
    fills: [
      [1, 1],
      [1, 2],
      [1, 3],
      [3, 1],
      [3, 2],
      [3, 3]
    ],
    crosses: [],
    highlightCols: [1, 2, 3]
  },
  {
    technique: 'Crosses',
    title: 'A satisfied line is empty elsewhere',
    body: 'Columns 1 and 5 each read [1], and the wings row already provides that single cell in each. So the rest of those two columns must be empty — mark the X’s down both sides.',
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
    title: 'A gap splits a line into separate runs',
    body: 'The bottom row reads [1,1] — two single cells with a gap between them. With the sides crossed off, the only way to fit two separated cells is under columns 2 and 4, so fill the two feet and mark the gap.',
    fills: [
      [4, 1],
      [4, 3]
    ],
    crosses: [[4, 2]],
    highlightRows: [4]
  },
  {
    technique: 'Joining',
    title: 'Reach up to the crest',
    body: "Column 3 reads [4]. It has three filled cells and the bottom is now blocked, so the run can only grow upward — into the crest. Fill the top of column 3, then mark the rest of the crest row. Your Cardinal is complete!",
    fills: [[0, 2]],
    crosses: [
      [0, 1],
      [0, 3]
    ],
    highlightRows: [0],
    highlightCols: [2]
  }
];
