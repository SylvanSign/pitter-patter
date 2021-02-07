import { HEX_TYPES, generateHexesFromConfig } from './util'

const HEXES = generateHexesFromConfig({
  width: 11,
  height: 7,
  [HEX_TYPES.human]: 'F04',
  [HEX_TYPES.alien]: 'F02',
  [HEX_TYPES.escape]: {
    1: 'B03',
    2: 'J03',
    3: 'E01',
    4: 'G01',
  },
  [HEX_TYPES.silent]: {
    B: [5],
    D: [3],
    E: [3, 7],
    F: [6],
    G: [3, 7],
    H: [3],
    J: [5],
  },
  [HEX_TYPES.danger]: {
    A: [3, 4],
    B: [2, 4],
    C: [3, 4, 6],
    D: [6],
    E: [2, 4, 5],
    F: [1, 3, 5],
    G: [2, 4, 5],
    H: [6],
    I: [3, 4, 6],
    J: [2, 4],
    K: [3, 4],
  },
})

export default HEXES
