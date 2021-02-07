import { HEX_TYPES, generateHexesFromConfig } from './util'

const HEXES = generateHexesFromConfig({
  width: 23,
  height: 14,
  [HEX_TYPES.human]: 'L08',
  [HEX_TYPES.alien]: 'L06',
  [HEX_TYPES.escape]: {
    1: 'B02',
    2: 'V02',
    3: 'V13',
    4: 'B13',
  },
  [HEX_TYPES.silent]: {
    A: [[4, 6], [9, 13]],
    B: [5, 10],
    C: [1, 14],
    D: [10, 14],
    E: [2, 12],
    F: [1, 10],
    G: [7, 12, 14],
    H: [[1, 3], 7, 14],
    I: [1, 9, 14],
    J: [1, 14],
    K: [2, 5, 9, 11],
    L: [2, 4, 9, 11, 14],
    M: [2, 5, 9, 11],
    N: [3, 14],
    O: [5, 9, 14],
    P: [1, 3, 4, 12],
    Q: [1, 4, 6, 11, 14],
    R: [1, 4, [6, 8], 12],
    T: [7, 8, 14],
    U: [1, 5, 12],
    V: [1, 8],
    W: [[3, 6], [10, 12]],
  },
  [HEX_TYPES.danger]: {
    A: [2, 3, 14],
    B: [1, 3, 4, 6, 8, 9, 11, 12, 14],
    C: [[2, 13]],
    D: [2, 3, 5, 8, 9, [11, 13]],
    E: [[3, 6], [8, 11], 13],
    F: [[2, 9], 11],
    G: [[1, 6], [8, 11], 13],
    H: [4, 6, 8, 9, 12, 13],
    I: [[2, 5], 7, 8, 10, 11, 13],
    J: [[2, 6], [8, 11], 13],
    K: [1, 3, 4, 6, 8, 10, 12, 14],
    L: [1, 3, 5, 10, 12, 13],
    M: [1, 3, 4, 6, 8, 10, [12, 14]],
    N: [1, 2, [4, 6], [8, 13]],
    O: [2, [6, 8], [10, 13]],
    P: [2, [5, 11], 13, 14],
    Q: [2, 3, 5, [7, 10], 12, 13],
    R: [2, 3, 5, 9, 13],
    S: [2, [4, 9], 12, 13],
    T: [2, 5, 6, [11, 13]],
    U: [[2, 4], [6, 11], 13, 14],
    V: [[3, 6], [9, 12], 14],
    W: [2, 9, 13, 14],
  },
})

export default HEXES
