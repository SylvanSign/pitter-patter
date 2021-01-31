import { INVALID_MOVE } from 'boardgame.io/core';
import gridGenerator from './maps/gridGenerator';
import MAPS from './maps';
import { HEX_TYPES, idToCartesian } from './maps/util';

const Game = {
  setup() {
    const [map, mapConfig] = Object.entries(MAPS)[0];// TODO make this selectable
    const gridData = gridGenerator(map);
    return {
      pos: gridData.grid.get(idToCartesian(mapConfig[HEX_TYPES.human])),
      gridData,
      map,
      mapConfig,
    };
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
