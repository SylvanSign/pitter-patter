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

  const mapConfig = MAPS[map]
  const fullGrid = Grid.rectangle({ width: mapConfig.width, height: mapConfig.height })
  const hexes = fullGrid
    .map(hex => {
      const { x, y } = hex.coordinates()
      const id = cartesianToId(x, y)
      const config = mapConfig[id]
      if (config) {
        return Hex(x, y, { id, type: config, accessible: !(config === HEX_TYPES.human || config === HEX_TYPES.alien), escape: config > 0 || config < 5 })
      }
      return null
    })
    .filter(hex => hex !== null)
  const grid = Grid(hexes)

  return {
    grid,
    Grid,
    Hex,
    fullGrid,
    corners: HexData().corners(),
  }
}
