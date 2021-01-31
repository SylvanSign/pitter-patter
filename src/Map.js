import { useEffect } from 'react';
import Tile from './Tile';
import { cartesianToId } from './maps/util';

export default function Map({ G, G: { map, gridData }, }) {
  const {
    grid,
    fullGrid,
    Grid,
    corners,
  } = gridData;
  const hexSVGs = grid.map(hex => {
    const { x, y } = hex.toPoint();
    const cartesian = hex.cartesian();
    const id = cartesianToId(cartesian.x, cartesian.y);
    return <Tile {...{ key: id, map, id, x, y }} />;
  });

  useEffect(() => {
    const svg = document.getElementById('map');
    const point = svg.createSVGPoint();
    const clickHandler = ({ clientX, clientY }) => {
      point.x = clientX;
      point.y = clientY;

      // The cursor point, translated into svg coordinates
      const { x, y } = point.matrixTransform(svg.getScreenCTM().inverse());
      const hexCoordinates = Grid.pointToHex(x, y)
      console.log(grid.get(hexCoordinates))
    };

    svg.addEventListener('click', clickHandler);
    return () => svg.removeEventListener('click', clickHandler);
  }, [grid, Grid]); // empty deps array, indicating only run after first render

  return (
    <svg id='map' viewBox={`0 0 ${fullGrid.pointWidth()} ${fullGrid.pointHeight()}`}>
      <defs>
        <symbol id='hex'>
          <polygon points={corners.map(({ x, y }) => `${x},${y}`).join(' ')} stroke='grey' strokeWidth='2' />
        </symbol>
        <pattern id="stripes" width="10" height="10" patternTransform="rotate(-40 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="10" stroke='darkgrey' strokeWidth='2' />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='white' />
      <rect width='100%' height='100%' fill='url(#stripes)' />
      {hexSVGs}
    </svg>
  );
}
