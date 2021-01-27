import * as Honeycomb from 'honeycomb-grid';
import { makeHexComponent } from './Hex';
import { coordNumToLetter } from './maps/util';

export default function Map({ map }) {
  const HexData = Honeycomb.extendHex({ orientation: 'flat', size: 30, });
  const GridGenerator = Honeycomb.defineGrid(HexData);

  const grid = GridGenerator.rectangle({ width: 23, height: 14 });
  const hexSVGs = grid.map(hex => {
    const { x, y } = hex.toPoint();
    const coords = hex.cartesian();
    const coordText = `${coordNumToLetter(coords.x)}${String(coords.y + 1).padStart(2, 0)}`;
    // use hexSymbol and set its position for each hex;
    return makeHexComponent({ map, coordText, x, y });
  });
  return (
    <svg viewBox={`0 0 ${grid.pointWidth()} ${grid.pointHeight()}`}>
      <defs>
        <symbol id='hex'>
          <polygon points={HexData().corners().map(({ x, y }) => `${x},${y}`).join(' ')} stroke='grey' strokeWidth='2' />
        </symbol>
        <pattern id="stripes" width="10" height="10" patternTransform="rotate(-50 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="10" stroke='grey' strokeWidth='1' />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='white' />
      <rect width='100%' height='100%' fill='url(#stripes)' />
      {hexSVGs}
    </svg>
  );
}
