import './App.css';
import * as Honeycomb from 'honeycomb-grid';

function App() {
  const Hex = Honeycomb.extendHex({ size: 20 });
  const Grid = Honeycomb.defineGrid(Hex);
  // get the corners of a hex (they're the same for all hexes created with the same Hex factory)
  const corners = Hex().corners();
  // an SVG symbol can be reused;

  // render 10,000 hexes;
  const hexSVGs = Grid.rectangle({ width: 10, height: 10 }).map(hex => {
    const { x, y } = hex.toPoint();
    // use hexSymbol and set its position for each hex;
    return <use key={`${x}-${y}`} {...{ 'xlinkHref': '#hex' }} transform={`translate(${x} ${y})`} />
  });

  return (
    <svg width='100%' height='100%'>
      <symbol id='hex'>
        <polygon points={corners.map(({ x, y }) => `${x},${y}`).join(' ')} fill='none' stroke='#999' strokeWidth='2' />
      </symbol>
      {hexSVGs}
    </svg>
  );
}

export default App;
