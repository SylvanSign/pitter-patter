import { HEX_TYPES, generateHexesFromConfig } from './util'

const HEXES = generateHexesFromConfig({
  width: 7,
  height: 6,
  [HEX_TYPES.human]: 'D05',
  [HEX_TYPES.alien]: 'F02',
  [HEX_TYPES.escape]: {
    1: 'B02',
  },
  [HEX_TYPES.silent]: {
    B: [3, 4],
    C: [2, 3, 5],
    D: [1, 4],
    E: [2, 3, 5],
    F: [3, 4],
  },
  [HEX_TYPES.danger]: {
    D: [3],
  },
})

export default HEXES
