export const HEX_TYPES = Object.freeze({
  empty: 'empty',
  silent: 'silent',
  danger: 'danger',
  human: 'human',
  alien: 'alien',
  escape: 'escape',
})

export function generateHexesFromConfig(hexConfig) {
  const baseConfig = {
    width: hexConfig.width,
    height: hexConfig.height,
    [HEX_TYPES.human]: hexConfig[HEX_TYPES.human],
    [HEX_TYPES.alien]: hexConfig[HEX_TYPES.alien],
    [HEX_TYPES.escape]: hexConfig[HEX_TYPES.escape],
  }
  return Object.freeze(Object.entries(hexConfig).reduce((hexes, [hexType, typeConfig]) => {
    switch (hexType) {
      case HEX_TYPES.silent:
      case HEX_TYPES.danger:
        for (const [c, rows] of Object.entries(typeConfig)) {
          for (let row of rows) {
            if (!(row instanceof Array)) {
              row = [row, row]
            }
            const [min, max] = row
            for (let r = min; r <= max; ++r) {
              hexes[`${c}${String(r).padStart(2, 0)}`] = hexType
            }
          }
        }
        break
      case HEX_TYPES.human:
        hexes[typeConfig] = HEX_TYPES.human
        break
      case HEX_TYPES.alien:
        hexes[typeConfig] = HEX_TYPES.alien
        break
      case HEX_TYPES.escape:
        hexes[typeConfig[1]] = 1
        hexes[typeConfig[2]] = 2
        hexes[typeConfig[3]] = 3
        hexes[typeConfig[4]] = 4
        break
      default:
    }
    return hexes
  }, baseConfig))
}

export function cartesianToId(x, y) {
  return `${String.fromCharCode(65 + x)}${String(y + 1).padStart(2, 0)}`
}

export function idToCartesian(id) {
  const x = id.charCodeAt(0) - 65
  const y = Number.parseInt(id.substring(1), 10) - 1
  return [x, y]
}

// from https://www.redblobgames.com/grids/hexagons/#range-obstacles
export function reachableHexes(grid, Hex, escapes, start, movement) {
  const startHex = new Hex(start)
  const visited = new Set([startHex]); // set of hexes
  const fringes = [[startHex]] // array of arrays of hexes
  const ignoreEscapes = movement > 1 // aliens cannot enter nor pass through escapes

  for (let k = 1; k <= movement; ++k) {
    fringes.push([])
    for (const hex of fringes[k - 1]) {
      for (const neighbor of grid.neighborsOf(new Hex(hex))) {
        if (neighbor
          && neighbor.accessible
          && !(neighbor.escape && ignoreEscapes)
          && !visited.has(neighbor)
          && !escapes[neighbor.type]
          && neighbor.id !== start.id) {
          visited.add(neighbor)
          fringes[k].push(neighbor)
        }
      }
    }
  }
  visited.delete(startHex) // TODO? must move every turn
  return Array.from(visited)
}
