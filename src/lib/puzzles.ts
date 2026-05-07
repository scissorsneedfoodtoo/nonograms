import type { Puzzle } from './types';

export const CAT_FACE_PUZZLE: Puzzle = {
  id: '1',
  name: 'Cat Face',
  width: 5,
  height: 5,
  solution: [
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0]
  ],
  colorSolution: [
    ['#4a4a4a', '#aed9e0', '#aed9e0', '#aed9e0', '#4a4a4a'],
    ['#6e6e6e', '#6e6e6e', '#6e6e6e', '#6e6e6e', '#6e6e6e'],
    ['#6e6e6e', '#2ecc71', '#6e6e6e', '#2ecc71', '#6e6e6e'],
    ['#6e6e6e', '#6e6e6e', '#ff9ff3', '#6e6e6e', '#6e6e6e'],
    ['#aed9e0', '#4a4a4a', '#4a4a4a', '#4a4a4a', '#aed9e0']
  ],
  rowClues: [[1, 1], [5], [1, 1, 1], [5], [3]],
  colClues: [[4], [1, 2], [4], [1, 2], [4]]
};

export const HEART_PUZZLE: Puzzle = {
  id: '2',
  name: 'Heart',
  width: 5,
  height: 5,
  solution: [
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0]
  ],
  colorSolution: [
    ['#ffcccc', '#ff4757', '#ffcccc', '#ff4757', '#ffcccc'],
    ['#ff4757', '#ff6b81', '#ff6b81', '#ff6b81', '#ff4757'],
    ['#ff4757', '#ff6b81', '#ff6b81', '#ff6b81', '#ff4757'],
    ['#ffcccc', '#ff4757', '#ff6b81', '#ff4757', '#ffcccc'],
    ['#ffcccc', '#ffcccc', '#ff4757', '#ffcccc', '#ffcccc']
  ],
  rowClues: [[1, 1], [5], [5], [3], [1]],
  colClues: [[2], [4], [4], [4], [2]]
};

export const ALL_PUZZLES: Puzzle[] = [CAT_FACE_PUZZLE, HEART_PUZZLE];
