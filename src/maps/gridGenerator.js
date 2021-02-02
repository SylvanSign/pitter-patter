import * as Honeycomb from 'honeycomb-grid'
import MAPS from '.'
import { cartesianToId, HEX_TYPES } from './util'

export default function gridGenerator(map) {
  const HexData = Honeycomb.extendHex({
    orientation: 'flat',
    size: 30,
  })
  const Grid = Honeycomb.defineGrid(HexData)
  const Hex = Grid.Hex

  const fullGrid = Grid.rectangle({ width: 23, height: 14 })
  const hexes = fullGrid
    .map(hex => {
      const { x, y } = hex.cartesian()
      const id = cartesianToId(x, y)
      const config = MAPS[map][id]
      if (config) {
        return Hex(x, y, { id, accessible: !(config === HEX_TYPES.human || config === HEX_TYPES.alien) })
      }
      return null
    })
    .filter(hex => hex !== null)
  const grid = Grid(hexes)

  return {
    grid,
    Grid,
    fullGrid,
    corners: HexData().corners(),
  }
}
