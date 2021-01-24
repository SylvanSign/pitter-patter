import { useState, useEffect } from 'react';
import MAPS from './maps';
import { HEX_TYPES } from './maps/util';

export default function Hex({ x, y, coordText, className, label = coordText }) {
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

export function makeHexComponent({ map, coordText, x, y }) {
  const hexInfo = MAPS[map][coordText];
  switch (hexInfo) {
    case HEX_TYPES.silent:
      return <Hex className='silent' {...{ coordText, x, y }} />;
    case HEX_TYPES.danger:
      return <Hex className='danger' {...{ coordText, x, y }} />;
    case HEX_TYPES.human:
      return <Hex className='key' label='H' {...{ coordText, x, y, }} />;
    case HEX_TYPES.alien:
      return <Hex className='key' label='A' {...{ coordText, x, y, }} />;
    // escape pods
    case 1:
    case 2:
    case 3:
    case 4:
      return <Hex className='key' label={hexInfo} {...{ coordText, x, y, }} />;
    // empty
    default:
  }
  return null;
}
