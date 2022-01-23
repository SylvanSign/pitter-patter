import { HEX_TYPES, generateHexesFromConfig } from './util'

const HEXES = generateHexesFromConfig({
  width: 7,
  height: 7,
  [HEX_TYPES.human]: 'D06',
  [HEX_TYPES.alien]: 'D03',
  [HEX_TYPES.escape]: {
    1: 'A02',
    2: 'C01',
    3: 'E02',
    4: 'G03',
  },
  [HEX_TYPES.silent]: {
    A: [3],
    B: [2],
    C: [2, [4, 8]],
    D: [2, 7],
    E: [3, 4, 6, 7],
    F: [3],
  },
  [HEX_TYPES.danger]: {
    D: [4, 5],
  },
})

export default HEXES
