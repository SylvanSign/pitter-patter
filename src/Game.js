import { INVALID_MOVE } from 'boardgame.io/core'
import gridGenerator from './maps/gridGenerator'
import MAPS from './maps'
import { HEX_TYPES, idToCartesian, reachableHexes } from './maps/util'

// TODO generally, remove all console.logs
const Game = {
  setup(ctx) {
    console.log(ctx)
    const [map, mapConfig] = Object.entries(MAPS)[1];// TODO make this selectable
    const gridData = gridGenerator(map)
    const pos = gridData.grid.get(idToCartesian(mapConfig[HEX_TYPES.human]))
    const moveSpeed = 1
    const reachable = reachableHexes(gridData.grid, pos, moveSpeed)

    return {
      players: {},
      pos,
      gridData,
      reachable,
      map,
      mapConfig,
      moveSpeed,
    }
  },

  endIf(G, ctx) {
    const hexType = G.mapConfig[G.pos.id]
    if (hexType > 0 || hexType < 5) {
      return { winner: ctx.currentPlayer }; // TODO flesh this out
    }
  },

  turn: {
    moveLimit: 1,
  },

  moves: {
    click(G, ctx, hex) {
      if (hex === G.pos) {
        alert('Cannot stay in same tile!')
        return INVALID_MOVE
      }

      switch (G.mapConfig[hex.id]) {
        case HEX_TYPES.human:
          alert('Cannot move into human spawn!'); // TODO something nicer :)
          return INVALID_MOVE
        case HEX_TYPES.alien:
          alert('Cannot move into alien spawn!'); // TODO something nicer :)
          return INVALID_MOVE
        default: // proceed
      }

      if (!G.reachable.has(hex)) {
        alert('Cannot yet reach that tile!')
        return INVALID_MOVE
      }

      G.pos = hex
      G.reachable = reachableHexes(G.gridData.grid, G.pos, G.moveSpeed)
    }
  },
}

export default Game
