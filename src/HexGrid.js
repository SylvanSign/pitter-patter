
import * as Honeycomb from 'honeycomb-grid';
import Map, { HEX } from './maps/galilei';
import { useState, useEffect } from 'react';

function coordNumToLetter(num) {
  return String.fromCharCode(65 + num);
}

function ActualHexComponentTodoRenameThis({ x, y, coordText, className, label = coordText }) {
  const [currentClassName, setCurrentClassName] = useState(className);

  function clickHandler() {
    console.log(coordText);
    setCurrentClassName('clicked');
  }

  useEffect(() => {
    const timer = setTimeout(() => setCurrentClassName(className), 1000);
    return () => clearTimeout(timer);
  }, [className, currentClassName]);

  return (
    <g onClick={clickHandler}>
      <use xlinkHref='#hex' className={currentClassName} transform={`translate(${x} ${y})`} />
      <text x={x + 15} y={y + 30} className={className}>{label}</text>
    </g>
  );
}

function Hexy({ coordText, x, y }) {
  const hexInfo = Map[coordText];
  switch (hexInfo) {
    case HEX.silent:
      return <ActualHexComponentTodoRenameThis className='silent' {...{ coordText, x, y }} />;
    case HEX.danger:
      return <ActualHexComponentTodoRenameThis className='danger' {...{ coordText, x, y }} />;
    case HEX.human:
      return <ActualHexComponentTodoRenameThis className='key' label='H' {...{ coordText, x, y, }} />;
    case HEX.alien:
      return <ActualHexComponentTodoRenameThis className='key' label='A' {...{ coordText, x, y, }} />;
    // escape pods
    case 1:
    case 2:
    case 3:
    case 4:
      return <ActualHexComponentTodoRenameThis className='key' label={hexInfo} {...{ coordText, x, y, }} />;
    // empty
    default:
  }
  return null;
}

export default function HexGrid() {
  const Hex = Honeycomb.extendHex({ orientation: 'flat', size: 30, });
  const Grid = Honeycomb.defineGrid(Hex);
  const corners = Hex().corners();

  const grid = Grid.rectangle({ width: 23, height: 14 });
  const hexSVGs = grid.map(hex => {
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
