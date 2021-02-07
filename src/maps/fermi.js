import { HEX_TYPES, generateHexesFromConfig } from './util'

const HEXES = generateHexesFromConfig({
  width: 11,
  height: 13,
  [HEX_TYPES.human]: 'F10',
  [HEX_TYPES.alien]: 'F09',
  [HEX_TYPES.escape]: {
    1: 'D05',
    2: 'H05',
    3: 'D01',
    4: 'H01',
  },
  [HEX_TYPES.silent]: {
    B: [10, 11],
    C: [6, 10],
    D: [4, 7, 8, [10, 12]],
    E: [2, 3, 8, 11],
    F: [[5, 8], 11, 12],
    G: [3, 8, 11, 13],
    H: [4, 8, 10, 11],
    I: [6, 7, 9, 12],
    J: [10],
  },
  [HEX_TYPES.danger]: {
    C: [7, 9, 12],
    D: [3],
    E: [4, 13],
    F: [3, 4],
    G: [2, 4],
    H: [3, 7, 12],
    I: [10],
    J: [11],
  },
})

export default HEXES
