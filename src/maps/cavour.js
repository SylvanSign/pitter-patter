import { HEX_TYPES, generateHexesFromConfig } from './util'

const HEXES = generateHexesFromConfig({
  width: 19,
  height: 11,
  [HEX_TYPES.human]: 'J08',
  [HEX_TYPES.alien]: 'J04',
  [HEX_TYPES.escape]: {
    1: 'M03',
    2: 'C07',
    3: 'R08',
  },
  [HEX_TYPES.silent]: {
    A: [7, 8],
    B: [6, 8],
    C: [5],
    D: [3, 6, 7, 9],
    E: [4],
    F: [3, 5, 7, 8],
    G: [6, 9],
    H: [2, 4, 7],
    I: [7, 9],
    J: [5, 6, 9],
    K: [2, 8],
    L: [1, 3, 5, 10],
    M: [2],
    N: [2, 4, 5, 7, 10],
    O: [3, 7],
    P: [6, 9],
    Q: [8, 10],
    S: [8, 9],
  },
  [HEX_TYPES.danger]: {
    B: [4, 5, 7],
    C: [4, 6, 8, 9],
    D: [4, 8],
    E: [5, [7, 9]],
    F: [4, 6],
    G: [[3, 5], 8],
    H: [3, 5, 8, 9],
    I: [3, 8, 10],
    J: [2, 7, 10],
    K: [7, 9, 10],
    L: [2, 7, 8],
    M: [4, 6, 8, 11],
    N: [3, 6],
    O: [4, 5, 10, 11],
    Q: [7, 9],
    R: [7, 9],
  },
})

export default HEXES
