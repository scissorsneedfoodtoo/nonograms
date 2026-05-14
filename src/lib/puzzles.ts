import type { Puzzle } from './types';

export const CAT_PUZZLE: Puzzle = {
  id: '1',
  name: 'Cat',
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

export const APPLE_PUZZLE: Puzzle = {
  id: '3',
  name: 'Apple',
  width: 5,
  height: 5,
  solution: [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0]
  ],
  colorSolution: [
    ['#f1f2f6', '#f1f2f6', '#2ecc71', '#f1f2f6', '#f1f2f6'],
    ['#f1f2f6', '#ff4757', '#ff4757', '#ff4757', '#f1f2f6'],
    ['#ff4757', '#ff6b81', '#ff6b81', '#ff6b81', '#ff4757'],
    ['#ff4757', '#ff6b81', '#ff6b81', '#ff6b81', '#ff4757'],
    ['#f1f2f6', '#ff4757', '#ff4757', '#ff4757', '#f1f2f6']
  ],
  rowClues: [[1], [3], [5], [5], [3]],
  colClues: [[2], [4], [5], [4], [2]]
};

export const TREE_PUZZLE: Puzzle = {
  id: '4',
  name: 'Tree',
  width: 5,
  height: 5,
  solution: [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0]
  ],
  colorSolution: [
    ['#eccc68', '#eccc68', '#2ed573', '#eccc68', '#eccc68'],
    ['#eccc68', '#2ed573', '#2ed573', '#2ed573', '#eccc68'],
    ['#2ed573', '#7bed9f', '#7bed9f', '#7bed9f', '#2ed573'],
    ['#eccc68', '#eccc68', '#a4b0be', '#eccc68', '#eccc68'],
    ['#eccc68', '#eccc68', '#a4b0be', '#eccc68', '#eccc68']
  ],
  rowClues: [[1], [3], [5], [1], [1]],
  colClues: [[1], [2], [5], [2], [1]]
};

export const HOUSE_PUZZLE: Puzzle = {
  id: '5',
  name: 'House',
  width: 5,
  height: 5,
  solution: [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1]
  ],
  colorSolution: [
    ['#f1f2f6', '#f1f2f6', '#ff4757', '#f1f2f6', '#f1f2f6'],
    ['#f1f2f6', '#ff4757', '#ff4757', '#ff4757', '#f1f2f6'],
    ['#ff4757', '#ff4757', '#ff4757', '#ff4757', '#ff4757'],
    ['#535c68', '#535c68', '#f1f2f6', '#535c68', '#535c68'],
    ['#535c68', '#535c68', '#535c68', '#535c68', '#535c68']
  ],
  rowClues: [[1], [3], [5], [2, 2], [5]],
  colClues: [[3], [4], [3, 1], [4], [3]]
};

export const STAR_PUZZLE: Puzzle = {
  id: '6',
  name: 'Star',
  width: 5,
  height: 5,
  solution: [
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1]
  ],
  colorSolution: [
    ['#2f3542', '#2f3542', '#eccc68', '#2f3542', '#2f3542'],
    ['#eccc68', '#eccc68', '#eccc68', '#eccc68', '#eccc68'],
    ['#2f3542', '#eccc68', '#eccc68', '#eccc68', '#2f3542'],
    ['#eccc68', '#eccc68', '#2f3542', '#eccc68', '#eccc68'],
    ['#eccc68', '#2f3542', '#2f3542', '#2f3542', '#eccc68']
  ],
  rowClues: [[1], [5], [3], [2, 2], [1, 1]],
  colClues: [[1, 2], [3], [3], [3], [1, 2]]
};

export const DIAMOND_PUZZLE: Puzzle = {
  id: '7',
  name: 'Diamond',
  width: 5,
  height: 5,
  solution: [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0]
  ],
  colorSolution: [
    ['#f1f2f6', '#f1f2f6', '#70a1ff', '#f1f2f6', '#f1f2f6'],
    ['#f1f2f6', '#70a1ff', '#1e90ff', '#70a1ff', '#f1f2f6'],
    ['#70a1ff', '#1e90ff', '#3742fa', '#1e90ff', '#70a1ff'],
    ['#f1f2f6', '#70a1ff', '#1e90ff', '#70a1ff', '#f1f2f6'],
    ['#f1f2f6', '#f1f2f6', '#70a1ff', '#f1f2f6', '#f1f2f6']
  ],
  rowClues: [[1], [3], [5], [3], [1]],
  colClues: [[1], [3], [5], [3], [1]]
};

export const SHIELD_PUZZLE: Puzzle = {
  id: '8',
  name: 'Shield',
  width: 5,
  height: 5,
  solution: [
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0]
  ],
  colorSolution: [
    ['#535c68', '#535c68', '#535c68', '#535c68', '#535c68'],
    ['#535c68', '#70a1ff', '#70a1ff', '#70a1ff', '#535c68'],
    ['#535c68', '#535c68', '#70a1ff', '#535c68', '#535c68'],
    ['#f1f2f6', '#535c68', '#535c68', '#535c68', '#f1f2f6'],
    ['#f1f2f6', '#f1f2f6', '#535c68', '#f1f2f6', '#f1f2f6']
  ],
  rowClues: [[5], [2, 2], [5], [3], [1]],
  colClues: [[3], [4], [1, 3], [4], [3]]
};

export const BOAT_PUZZLE: Puzzle = {
  id: '9',
  name: 'Boat',
  width: 5,
  height: 5,
  solution: [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1]
  ],
  colorSolution: [
    ['#aed9e0', '#aed9e0', '#ffffff', '#aed9e0', '#aed9e0'],
    ['#aed9e0', '#ffffff', '#ffffff', '#aed9e0', '#aed9e0'],
    ['#ff4757', '#ff4757', '#ff4757', '#ff4757', '#ff4757'],
    ['#aed9e0', '#ff4757', '#ff4757', '#ff4757', '#aed9e0'],
    ['#3742fa', '#3742fa', '#3742fa', '#3742fa', '#3742fa']
  ],
  rowClues: [[1], [2], [5], [3], [5]],
  colClues: [[1, 1], [4], [5], [3], [1, 1]]
};

export const DUCK_PUZZLE: Puzzle = {
  id: '10',
  name: 'Duck',
  width: 5,
  height: 5,
  solution: [
    [0, 1, 1, 0, 0],
    [1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1]
  ],
  colorSolution: [
    ['#f1f2f6', '#eccc68', '#eccc68', '#f1f2f6', '#f1f2f6'],
    ['#eccc68', '#eccc68', '#eccc68', '#f1f2f6', '#f1f2f6'],
    ['#f1f2f6', '#eccc68', '#eccc68', '#eccc68', '#eccc68'],
    ['#f1f2f6', '#eccc68', '#eccc68', '#eccc68', '#f1f2f6'],
    ['#70a1ff', '#70a1ff', '#70a1ff', '#70a1ff', '#70a1ff']
  ],
  rowClues: [[2], [3], [4], [3], [5]],
  colClues: [[1, 1], [5], [5], [3], [1, 1]]
};

export const MUSHROOM_PUZZLE: Puzzle = {
  id: '11',
  name: 'Mushroom',
  width: 5,
  height: 5,
  solution: [
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0]
  ],
  colorSolution: [
    ['#2870c0', '#ff4757', '#ff4757', '#ff4757', '#2870c0'],
    ['#ff4757', '#ffffff', '#ff4757', '#ffffff', '#ff4757'],
    ['#ff4757', '#ff4757', '#ff4757', '#ff4757', '#ff4757'],
    ['#2870c0', '#ffffff', '#ffffff', '#ffffff', '#2870c0'],
    ['#2870c0', '#2870c0', '#ffffff', '#2870c0', '#2870c0']
  ],
  rowClues: [[3], [5], [5], [3], [1]],
  colClues: [[2], [4], [5], [4], [2]]
};

export const COFFEE_MUG_PUZZLE: Puzzle = {
  id: '12',
  name: 'Coffee Mug',
  width: 5,
  height: 5,
  solution: [
    [1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1],
    [1, 1, 1, 1, 0],
    [0, 1, 1, 1, 0]
  ],
  colorSolution: [
    ['#8b5e3c', '#8b5e3c', '#8b5e3c', '#8b5e3c', '#ffffff'],
    ['#8b5e3c', '#8b5e3c', '#8b5e3c', '#8b5e3c', '#8b5e3c'],
    ['#8b5e3c', '#c49a6c', '#8b5e3c', '#8b5e3c', '#8b5e3c'],
    ['#8b5e3c', '#8b5e3c', '#8b5e3c', '#8b5e3c', '#ffffff'],
    ['#ffffff', '#c49a6c', '#c49a6c', '#c49a6c', '#ffffff']
  ],
  rowClues: [[4], [5], [1, 3], [4], [3]],
  colClues: [[4], [2, 2], [5], [5], [2]]
};

export const ROCKET_PUZZLE: Puzzle = {
  id: '13',
  name: 'Rocket',
  width: 10,
  height: 10,
  solution: [
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1]
  ],
  colorSolution: [
    [
      '#0c2461',
      '#0c2461',
      '#0c2461',
      '#0c2461',
      '#e74c3c',
      '#e74c3c',
      '#0c2461',
      '#0c2461',
      '#0c2461',
      '#0c2461'
    ],
    [
      '#0c2461',
      '#0c2461',
      '#0c2461',
      '#dcdde1',
      '#dcdde1',
      '#dcdde1',
      '#dcdde1',
      '#0c2461',
      '#0c2461',
      '#0c2461'
    ],
    [
      '#0c2461',
      '#0c2461',
      '#0c2461',
      '#dcdde1',
      '#2c3e50',
      '#2c3e50',
      '#dcdde1',
      '#0c2461',
      '#0c2461',
      '#0c2461'
    ],
    [
      '#0c2461',
      '#0c2461',
      '#0c2461',
      '#dcdde1',
      '#dcdde1',
      '#dcdde1',
      '#dcdde1',
      '#0c2461',
      '#0c2461',
      '#0c2461'
    ],
    [
      '#0c2461',
      '#0c2461',
      '#dcdde1',
      '#dcdde1',
      '#dcdde1',
      '#dcdde1',
      '#dcdde1',
      '#dcdde1',
      '#0c2461',
      '#0c2461'
    ],
    [
      '#0c2461',
      '#0c2461',
      '#dcdde1',
      '#dcdde1',
      '#dcdde1',
      '#dcdde1',
      '#dcdde1',
      '#dcdde1',
      '#0c2461',
      '#0c2461'
    ],
    [
      '#0c2461',
      '#0c2461',
      '#dcdde1',
      '#dcdde1',
      '#dcdde1',
      '#dcdde1',
      '#dcdde1',
      '#dcdde1',
      '#0c2461',
      '#0c2461'
    ],
    [
      '#0c2461',
      '#7f8c8d',
      '#7f8c8d',
      '#dcdde1',
      '#dcdde1',
      '#dcdde1',
      '#dcdde1',
      '#7f8c8d',
      '#7f8c8d',
      '#0c2461'
    ],
    [
      '#0c2461',
      '#0c2461',
      '#0c2461',
      '#7f8c8d',
      '#7f8c8d',
      '#7f8c8d',
      '#7f8c8d',
      '#0c2461',
      '#0c2461',
      '#0c2461'
    ],
    [
      '#f1c40f',
      '#0c2461',
      '#e67e22',
      '#0c2461',
      '#e74c3c',
      '#e74c3c',
      '#0c2461',
      '#e67e22',
      '#0c2461',
      '#f1c40f'
    ]
  ],
  rowClues: [[2], [4], [4], [4], [6], [6], [6], [8], [4], [1, 1, 2, 1, 1]],
  colClues: [[1], [1], [4, 1], [8], [10], [10], [8], [4, 1], [1], [1]]
};

export const GHOST_PUZZLE: Puzzle = {
  id: '14',
  name: 'Ghost',
  width: 10,
  height: 10,
  solution: [
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1]
  ],
  colorSolution: [
    [
      '#1e272e',
      '#1e272e',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#1e272e',
      '#1e272e'
    ],
    [
      '#1e272e',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#1e272e'
    ],
    [
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa'
    ],
    [
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#1e272e',
      '#f5f6fa',
      '#f5f6fa',
      '#1e272e',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa'
    ],
    [
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#1e272e',
      '#f5f6fa',
      '#f5f6fa',
      '#1e272e',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa'
    ],
    [
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa'
    ],
    [
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa'
    ],
    [
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa',
      '#f5f6fa'
    ],
    [
      '#f5f6fa',
      '#1e272e',
      '#1e272e',
      '#f5f6fa',
      '#1e272e',
      '#1e272e',
      '#f5f6fa',
      '#1e272e',
      '#1e272e',
      '#f5f6fa'
    ],
    [
      '#f5f6fa',
      '#1e272e',
      '#1e272e',
      '#f5f6fa',
      '#1e272e',
      '#1e272e',
      '#f5f6fa',
      '#1e272e',
      '#1e272e',
      '#f5f6fa'
    ]
  ],
  rowClues: [[6], [8], [10], [3, 2, 3], [3, 2, 3], [10], [10], [10], [1, 1, 1, 1], [1, 1, 1, 1]],
  colClues: [[8], [7], [8], [3, 5], [8], [8], [3, 5], [8], [7], [8]]
};

export const CACTUS_PUZZLE: Puzzle = {
  id: '15',
  name: 'Cactus',
  width: 10,
  height: 10,
  solution: [
    [1, 1, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0]
  ],
  colorSolution: [
    [
      '#2d6a4f',
      '#2d6a4f',
      '#f1f2f6',
      '#f1f2f6',
      '#2d6a4f',
      '#2d6a4f',
      '#eccc68',
      '#eccc68',
      '#eccc68',
      '#eccc68'
    ],
    [
      '#2d6a4f',
      '#2d6a4f',
      '#f1f2f6',
      '#f1f2f6',
      '#2d6a4f',
      '#2d6a4f',
      '#eccc68',
      '#2d6a4f',
      '#2d6a4f',
      '#eccc68'
    ],
    [
      '#2d6a4f',
      '#2d6a4f',
      '#2d6a4f',
      '#2d6a4f',
      '#2d6a4f',
      '#2d6a4f',
      '#eccc68',
      '#2d6a4f',
      '#2d6a4f',
      '#eccc68'
    ],
    [
      '#2d6a4f',
      '#2d6a4f',
      '#2d6a4f',
      '#2d6a4f',
      '#2d6a4f',
      '#2d6a4f',
      '#2d6a4f',
      '#2d6a4f',
      '#2d6a4f',
      '#eccc68'
    ],
    [
      '#f1f2f6',
      '#f1f2f6',
      '#f1f2f6',
      '#f1f2f6',
      '#2d6a4f',
      '#2d6a4f',
      '#2d6a4f',
      '#2d6a4f',
      '#2d6a4f',
      '#f1f2f6'
    ],
    [
      '#f1f2f6',
      '#f1f2f6',
      '#f1f2f6',
      '#f1f2f6',
      '#2d6a4f',
      '#2d6a4f',
      '#f1f2f6',
      '#f1f2f6',
      '#f1f2f6',
      '#f1f2f6'
    ],
    [
      '#f1f2f6',
      '#f1f2f6',
      '#8b5e3c',
      '#8b5e3c',
      '#8b5e3c',
      '#8b5e3c',
      '#8b5e3c',
      '#8b5e3c',
      '#f1f2f6',
      '#f1f2f6'
    ],
    [
      '#f1f2f6',
      '#f1f2f6',
      '#f1f2f6',
      '#c1440e',
      '#c1440e',
      '#c1440e',
      '#c1440e',
      '#f1f2f6',
      '#f1f2f6',
      '#f1f2f6'
    ],
    [
      '#f1f2f6',
      '#f1f2f6',
      '#f1f2f6',
      '#c1440e',
      '#c1440e',
      '#c1440e',
      '#c1440e',
      '#f1f2f6',
      '#f1f2f6',
      '#f1f2f6'
    ],
    [
      '#f1f2f6',
      '#f1f2f6',
      '#f1f2f6',
      '#c1440e',
      '#c1440e',
      '#c1440e',
      '#c1440e',
      '#f1f2f6',
      '#f1f2f6',
      '#f1f2f6'
    ]
  ],
  rowClues: [[2, 6], [2, 6], [10], [10], [5], [2], [6], [4], [4], [4]],
  colClues: [[4], [4], [2, 1], [2, 4], [10], [10], [5, 4], [5, 1], [5], [4]]
};

export const CROWN_PUZZLE: Puzzle = {
  id: '16',
  name: 'Crown',
  width: 10,
  height: 10,
  solution: [
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 1, 0, 1, 0, 0, 1, 0, 1, 1],
    [1, 1, 0, 1, 0, 0, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0]
  ],
  colorSolution: [
    [
      '#f39c12',
      '#1a1a2e',
      '#1a1a2e',
      '#f39c12',
      '#1a1a2e',
      '#1a1a2e',
      '#f39c12',
      '#1a1a2e',
      '#1a1a2e',
      '#f39c12'
    ],
    [
      '#f39c12',
      '#f39c12',
      '#1a1a2e',
      '#f39c12',
      '#1a1a2e',
      '#1a1a2e',
      '#f39c12',
      '#1a1a2e',
      '#f39c12',
      '#f39c12'
    ],
    [
      '#f39c12',
      '#f39c12',
      '#1a1a2e',
      '#f39c12',
      '#1a1a2e',
      '#1a1a2e',
      '#f39c12',
      '#1a1a2e',
      '#f39c12',
      '#f39c12'
    ],
    [
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f'
    ],
    [
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f'
    ],
    [
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f'
    ],
    [
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f',
      '#f1c40f'
    ],
    [
      '#1a1a2e',
      '#d4ac0d',
      '#d4ac0d',
      '#d4ac0d',
      '#d4ac0d',
      '#d4ac0d',
      '#d4ac0d',
      '#d4ac0d',
      '#d4ac0d',
      '#1a1a2e'
    ],
    [
      '#1a1a2e',
      '#d4ac0d',
      '#d4ac0d',
      '#d4ac0d',
      '#d4ac0d',
      '#d4ac0d',
      '#d4ac0d',
      '#d4ac0d',
      '#d4ac0d',
      '#1a1a2e'
    ],
    [
      '#1a1a2e',
      '#1a1a2e',
      '#d4ac0d',
      '#d4ac0d',
      '#d4ac0d',
      '#d4ac0d',
      '#d4ac0d',
      '#d4ac0d',
      '#1a1a2e',
      '#1a1a2e'
    ]
  ],
  rowClues: [[1, 1, 1, 1], [2, 1, 1, 2], [2, 1, 1, 2], [10], [10], [10], [10], [8], [8], [6]],
  colClues: [[7], [8], [7], [10], [7], [7], [10], [7], [8], [7]]
};

export const ALL_PUZZLES: Puzzle[] = [
  CAT_PUZZLE,
  HEART_PUZZLE,
  APPLE_PUZZLE,
  TREE_PUZZLE,
  HOUSE_PUZZLE,
  STAR_PUZZLE,
  DIAMOND_PUZZLE,
  SHIELD_PUZZLE,
  BOAT_PUZZLE,
  DUCK_PUZZLE,
  MUSHROOM_PUZZLE,
  COFFEE_MUG_PUZZLE,
  ROCKET_PUZZLE,
  GHOST_PUZZLE,
  CACTUS_PUZZLE,
  CROWN_PUZZLE
];
