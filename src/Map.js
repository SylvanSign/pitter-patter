import * as Honeycomb from 'honeycomb-grid';
import { makeHexComponent } from './Hex';
import MAPS from './maps';
import { cartesianToCoordText } from './maps/util';

export default function Map({ map }) {
  const HexData = Honeycomb.extendHex({ orientation: 'flat', size: 30, });
  const GridGenerator = Honeycomb.defineGrid(HexData);
  const Hex = GridGenerator.Hex;

  const fullGrid = GridGenerator.rectangle({ width: 23, height: 14 });
  const hexes = fullGrid
    .map(hex => {
      const { x, y } = hex.cartesian();
      const coordText = cartesianToCoordText(x, y);
      if (MAPS[map][coordText]) {
        return Hex(x, y);
      }
      return null;
    })
    .filter(hex => hex !== null);
  const grid = GridGenerator(hexes);

  const hexSVGs = grid.map(hex => {
    const { x, y } = hex.toPoint();
    const cartesian = hex.cartesian();
    const coordText = cartesianToCoordText(cartesian.x, cartesian.y);
    // use hexSymbol and set its position for each hex;
    return makeHexComponent({ map, coordText, x, y });
  });
  return (
    <svg viewBox={`0 0 ${fullGrid.pointWidth()} ${fullGrid.pointHeight()}`}>
      <defs>
        <symbol id='hex'>
          <polygon points={HexData().corners().map(({ x, y }) => `${x},${y}`).join(' ')} stroke='grey' strokeWidth='2' />
        </symbol>
        <pattern id="stripes" width="10" height="10" patternTransform="rotate(-50 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="10" stroke='grey' strokeWidth='2' />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='white' />
      <rect width='100%' height='100%' fill='url(#stripes)' />
      {hexSVGs}
    </svg>
  );
}
