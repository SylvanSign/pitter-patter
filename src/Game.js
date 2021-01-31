import { INVALID_MOVE } from 'boardgame.io/core';
import gridGenerator from './maps/gridGenerator';
import MAPS from './maps';

const PitterPatter = {
  setup() {
    const map = Object.keys(MAPS)[0];// TODO make this selectable
    const gridData = gridGenerator(map);
    return {
      pos: null,
      gridData,
      map,
    };
  },

  turn: {
    moveLimit: 1,
  },

  moves: {
    click(G, ctx, hex) {
      if (!G.gridData.grid.includes(hex)) { // TODO check for impassible hexes like starting hexes
        return INVALID_MOVE;
      }
      G.pos = hex;
    }
  },
};

export default PitterPatter;
