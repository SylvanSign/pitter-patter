import { HEX, generateHexesFromConfig } from './util';

const HEXES = generateHexesFromConfig({
  [HEX.silent]: {
    H: [10, 11],
    I: [6, 10],
    J: [4, 7, 8, [10, 12]],
    K: [2, 3, 8, 11],
    L: [[5, 8], 11, 12],
    M: [3, 8, 11, 13],
    N: [4, 8, 10, 11],
    O: [6, 7, 9, 12],
    P: [10],
  },
  [HEX.danger]: {
    H: [],
    I: [7, 9, 12],
    J: [3],
    K: [4, 13],
    L: [3, 4],
    M: [2, 4],
    N: [3, 7, 12],
    O: [10],
    P: [11],
  },
  [HEX.human]: 'L10',
  [HEX.alien]: 'L09',
  [HEX.escape]: {
    1: 'J05',
    2: 'N05',
    3: 'J01',
    4: 'N01',
  },
});

export default HEXES;
