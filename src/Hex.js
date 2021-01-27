import { useState, useEffect, useRef } from 'react';
import MAPS from './maps';
import { HEX_TYPES } from './maps/util';

export default function Hex({ x, y, coordText, className, label = coordText }) {
  const [currentClassName, setCurrentClassName] = useState(className);
  const timer = useRef();

  // cleanup any dangling resources when component unmounts
  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  function onClick() {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCurrentClassName(className), 3000)
    setCurrentClassName('clicked');
  }

  return (
    <g onClick={onClick}>
      <use xlinkHref='#hex' className={currentClassName} transform={`translate(${x} ${y})`} />
      <text x={x + 15} y={y + 30} className={className}>{label}</text>
    </g>
  );
}

export function makeHexComponent({ map, coordText, x, y }) {
  const hexInfo = MAPS[map][coordText];
  const key = `${map}${coordText}`;
  const otherProps = { key, coordText, x, y };

  switch (hexInfo) {
    case HEX_TYPES.silent:
      return <Hex className='silent' {...otherProps} />;
    case HEX_TYPES.danger:
      return <Hex className='danger' {...otherProps} />;
    case HEX_TYPES.human:
      return <Hex className='key' label='H' {...otherProps} />;
    case HEX_TYPES.alien:
      return <Hex className='key' label='A' {...otherProps} />;
    // escape pods
    case 1:
    case 2:
    case 3:
    case 4:
      return <Hex className='key' label={hexInfo} {...otherProps} />;
    // empty
    default:
      throw new Error('Map component should not try to render empty hexes!');
  }
}
