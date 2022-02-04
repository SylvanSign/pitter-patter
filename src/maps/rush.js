import { HEX_TYPES, generateHexesFromConfig } from './util'

const HEXES = generateHexesFromConfig({
  width: 24,
  height: 8,
  [HEX_TYPES.human]: 'L04',
  [HEX_TYPES.alien]: 'B05',
  [HEX_TYPES.escape]: {
    1: 'W02',
    2: 'W04',
    3: 'W06',
    4: 'W08',
  },
  [HEX_TYPES.silent]: {
    U: [2, 4, 6, 8],
  },
  [HEX_TYPES.danger]: {
    C: [5],
    D: [5],
    E: [5],
    F: [5],
    G: [5],
    H: [5],
    I: [5],
    J: [5],
    K: [5],
    L: [5],
    M: [5],
    N: [4, 5],
    O: [4, 6],
    P: [3, 6],
    Q: [3, 7],
    R: [2, 3, 6, 7],
    S: [2, 4, 6, 8],
    T: [1, 3, 6, 8],
    V: [1, 3, 6, 8],
  },
})

export default HEXES
