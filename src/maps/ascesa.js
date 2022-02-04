import { HEX_TYPES, generateHexesFromConfig } from './util'

const HEXES = generateHexesFromConfig({
  width: 11,
  height: 10,
  [HEX_TYPES.human]: 'D02',
  [HEX_TYPES.alien]: 'E05',
  [HEX_TYPES.escape]: {
    1: 'F07',
    2: 'G08',
    3: 'H08',
    4: 'I09',
  },
  [HEX_TYPES.silent]: {
    C: [2, 4, 6, 8],
    D: [1, 3, 6],
    E: [10],
    F: [1, 3, 5, 8],
    G: [10],
    H: [4, 6],
    I: [3, 6, 8, 10],
    J: [4, 8],
  },
  [HEX_TYPES.danger]: {
    B: [4, 5],
    C: [3, 5, 7],
    D: [5, 7, 8],
    E: [2, 3, 9],
    F: [4, 10],
    G: [2, 3, 5, 7],
    H: [3, 9],
    I: [5, 7],
    J: [3, 5, 9],
  },
})

export default HEXES
