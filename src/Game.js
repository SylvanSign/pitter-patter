import { INVALID_MOVE } from 'boardgame.io/core';
import gridGenerator from './maps/gridGenerator';
import MAPS from './maps';
import { HEX_TYPES, idToCartesian } from './maps/util';

// TODO generally, remove all console.logs
const Game = {
  setup() {
    const [map, mapConfig] = Object.entries(MAPS)[1];// TODO make this selectable
    const gridData = gridGenerator(map);
    return {
      pos: gridData.grid.get(idToCartesian(mapConfig[HEX_TYPES.human])),
      gridData,
      map,
      mapConfig,
    };
  },

  endIf(G, ctx) {
    const hexType = G.mapConfig[G.pos.id];
    if (hexType > 0 || hexType < 5) {
      return { winner: ctx.currentPlayer }; // TODO flesh this out
    }
  },

  turn: {
    moveLimit: 1,
  },

  moves: {
    click(G, ctx, hex) {
      switch (G.mapConfig[hex.id]) {
        case HEX_TYPES.human:
          alert('Cannot move into human spawn!'); // TODO something nicer :)
          return INVALID_MOVE;
        case HEX_TYPES.alien:
          alert('Cannot move into alien spawn!'); // TODO something nicer :)
          return INVALID_MOVE;
        default: // proceed
      }

      G.pos = hex;
    }
  },
};

export default Game;
