import { HEX_TYPES, generateHexesFromConfig } from './util'

const HEXES = generateHexesFromConfig({
  width: 23,
  height: 14,
  [HEX_TYPES.human]: 'L08',
  [HEX_TYPES.alien]: 'L06',
  [HEX_TYPES.escape]: {
    1: 'F01',
    2: 'P01',
    3: 'V11',
    4: 'B10',
  },
  [HEX_TYPES.silent]: {
    A: [8],
    B: [4, 11],
    D: [7],
    G: [2, 10],
    H: [5, 7, 12],
    K: [3, 9, 10, 14],
    L: [3, 12],
    M: [5, 9, 14],
    N: [2, 11],
    O: [3, 5, 9, 14],
    Q: [2, 14],
    R: [5],
    T: [9],
    U: [8],
    V: [1, 7],
  },
  [HEX_TYPES.danger]: {
    A: [[3, 7], [9, 12]],
    B: [2, 12],
    C: [2, [4, 11], 13],
    D: [1, 3, 12],
    E: [1, 3, [5, 10], 12],
    F: [2, 4, 10, 11],
    G: [4, [6, 9], 11, 13],
    H: [2, 3, 9, 11, 13],
    I: [2, 3, 5, 7, 8, 10, 12, 14],
    J: [1, 3, 4, 6, 8, 10, 14],
    K: [1, 4, 6, 11, 13],
    L: [1, 5, 9, 11, 13],
    M: [1, 2, 4, 6, 11],
    N: [1, 4, 6, 8, 10, 12, 14],
    O: [2, 7, 8, 10, 12],
    P: [2, 3, 5, 9, 11, 14],
    Q: [1, 3, 4, [6, 9], 11],
    R: [1, 3, 4, 10, 13, 14],
    S: [1, 2, [4, 10], 13, 14],
    T: [1, 2, 11, 12, 14],
    U: [1, 3, 4, [10, 12], 14],
    V: [[2, 4], 8, 13],
    W: [[3, 13]],
  },
})

export default HEXES
