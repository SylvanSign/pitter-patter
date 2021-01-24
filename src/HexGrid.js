
import * as Honeycomb from 'honeycomb-grid';
import Map, { HEX } from './maps/galilei';

function coordNumToLetter(num) {
  return String.fromCharCode(65 + num);
}


function Hexy({ coordText, x, y }) {
  switch (Map[coordText]) {
    case HEX.silent:
      return (
        <g class='silent'>
          <use xlinkHref='#hex' transform={`translate(${x} ${y})`} />
          <text x={x + 15} y={y + 30} class='hex-text'>{coordText}</text>
        </g>
      );
    case HEX.danger:
      return (
        <g class='danger'>
          <use xlinkHref='#hex' transform={`translate(${x} ${y})`} />
          <text x={x + 15} y={y + 30} class='hex-text'>{coordText}</text>
        </g>
      );
    case HEX.human:
      break;
    case HEX.alien:
      break;
    case HEX.escape:
      break;
    default:
      break;
  }
  return null;
}

export default function HexGrid() {
  const Hex = Honeycomb.extendHex({ orientation: 'flat', size: 30, });
  const Grid = Honeycomb.defineGrid(Hex);
  // get the corners of a hex (they're the same for all hexes created with the same Hex factory)
  const corners = Hex().corners();
  // an SVG symbol can be reused;

  // render 10,000 hexes;
  const hexSVGs = Grid.rectangle({ width: 23, height: 14 }).map(hex => {
    const { x, y } = hex.toPoint();
    const coords = hex.cartesian();
    const coordText = `${coordNumToLetter(coords.x)}${String(coords.y + 1).padStart(2, 0)}`;
    // use hexSymbol and set its position for each hex;
    return <Hexy key={coordText} {...{ x, y, coordText }} />
  });

  return (
    <svg>
      <symbol id='hex'>
        <polygon points={corners.map(({ x, y }) => `${x},${y}`).join(' ')} stroke='grey' strokeWidth='3' />
      </symbol>
      <pattern id="stripes" width="10" height="10" patternTransform="rotate(-50 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="10" stroke='grey' strokeWidth='0.5' />
      </pattern>
      <rect width='100%' height='100%' fill='white' />
      <rect width='100%' height='100%' fill='url(#stripes)' />
      {hexSVGs}
    </svg>
  );
}
