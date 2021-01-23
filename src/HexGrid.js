
import * as Honeycomb from 'honeycomb-grid';

export default function HexGrid() {
  const Hex = Honeycomb.extendHex({ size: 30 });
  const Grid = Honeycomb.defineGrid(Hex);
  // get the corners of a hex (they're the same for all hexes created with the same Hex factory)
  const corners = Hex().corners();
  // an SVG symbol can be reused;

  // render 10,000 hexes;
  const hexSVGs = Grid.rectangle({ width: 10, height: 10 }).map(hex => {
    const { x, y } = hex.toPoint();
    const key = `${x}-${y}`;
    const coords = hex.cartesian();
    const coordText = `${coords.x},${coords.y}`;
    // use hexSymbol and set its position for each hex;
    return (
      <>
        <use key={key} xlinkHref='#hex' transform={`translate(${x} ${y})`} onClick={() => console.log('TODO')} />
        <text x={x + 15} y={y + 30} class="small">{coordText}</text>
      </>
    )
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
