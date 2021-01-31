import { INVALID_MOVE } from 'boardgame.io/core';
import gridGenerator from './maps/gridGenerator';

const PitterPatter = {
  setup() {
    const map = 'fermi';// TODO make this selectable
    const gridData = gridGenerator(map);
    return {
      gridData,
      map,
    };
  },

  turn: {
    moveLimit: 1,
  },

  moves: {
    click(G, ctx, hex) {
      if (!G.grid.includes(hex)) {
        return INVALID_MOVE;
      }
      G.pos = G.Grid.Hex(hex);
    }
  },
};

export default PitterPatter;
