
import * as Honeycomb from 'honeycomb-grid';
import Map from './maps/galilei';

function coordNumToLetter(num) {
  return String.fromCharCode(65 + num);
}


function Hexy({ coordText, x, y }) {
  console.log(coordText, Map[coordText]);
  return (
    <g>
      <use xlinkHref='#hex' transform={`translate(${x} ${y})`} onClick={() => console.log('TODO')} />
      <text x={x + 15} y={y + 30} class="hex-text">{coordText}</text>
    </g>
  );
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
        <polygon points={corners.map(({ x, y }) => `${x},${y}`).join(' ')} fill='none' stroke='#999' strokeWidth='2' />
      </symbol>
      {hexSVGs}
    </svg>
  );
}
