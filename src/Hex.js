import { useState, useMemo } from 'react';
import MAPS from './maps';
import { HEX_TYPES } from './maps/util';

export default function Hex({ inRange, todoRenameThis, x, y, coordText, className, label = coordText }) {
  const [currentClassName, setCurrentClassName] = useState(className);

  useMemo(() => {
    if (inRange) {
      setCurrentClassName('clicked');
    } else {
      setCurrentClassName(className);
    }
  }, [inRange, className]);

  function enter() {
    todoRenameThis(coordText);
  }

  function leave() {
    todoRenameThis(null);
  }

  return (
    <g onMouseEnter={enter} onMouseLeave={leave}>
      <use xlinkHref='#hex' className={currentClassName} transform={`translate(${x} ${y})`} />
      {label > 0 && label < 5 ?
        <g>
          <text transform={`translate(${x + 20} ${y + 35})`} className={className}>{label}</text>
          <svg viewBox="0 0 134 116" width='60' height='60' x={x} y={y - 5}>
            <path d="M94.427,106.959l-46.254,-0.011l0,-9.349l40.856,0.011l20.423,-35.37l8.102,4.668l-23.127,40.051Z" style={{ fill: 'white', fillRule: 'nonzero' }} />
            <path d="M24.543,53.766l-8.097,-4.674l23.127,-40.051l46.243,0.011l0,9.349l-40.851,-0.006l-20.422,35.371Z" style={{ fill: 'white', fillRule: 'nonzero' }} />
          </svg>
        </g>
        :
        label === 'H' ?
          <svg viewBox="0 0 134 116" width='60' height='60' x={x} y={y - 5}>
            <path d="M67.009,100.979l-33.996,-19.624l0,-56.517l16.998,-9.817l4.067,7.058l-12.921,7.456l0,47.117l25.852,14.927l25.834,-14.927l0,-47.117l-12.912,-7.456l4.072,-7.058l16.984,9.817l0,56.517l-33.978,19.624Z" style={{ fill: 'white', fillRule: 'nonzero' }} />
            <path d="M67.009,66.431l-31.958,-18.444l4.072,-7.058l27.886,16.103l27.872,-16.103l4.072,7.058l-31.944,18.444Z" style={{ fill: 'white', fillRule: 'nonzero' }} />
          </svg>
          :
          label === 'A' ?
            <svg viewBox="0 0 134 116" width='60' height='60' x={x} y={y - 5}>
              <path d="M66.995,44.187l-31.918,-18.101l4.015,-7.086l27.903,15.826l27.908,-15.826l4.02,7.086l-31.928,18.101Z" style={{ fill: 'white', fillRule: 'nonzero' }} />
              <path d="M33.013,97.384l0,-43.289l33.895,-19.215l34.079,17.566l0,44.938l-33.994,-19.272l-33.98,19.272Zm33.98,-28.628l25.846,14.65l0,-25.997l-25.756,-13.272l-25.927,14.703l0,24.566l25.837,-14.65Z" style={{ fill: 'white', fillRule: 'nonzero' }} />
              <path d="M134,58.024l-33.5,58.023l-67,0l-33.5,-58.023l33.5,-58.024l67,0l33.5,58.024Z" style={{ fill: 'none', stroke: '#000', strokeWidth: '1px' }} />
            </svg>
            :
            className === 'danger' ?
              <g>
                <svg viewBox="0 0 134 116" width='60' height='60' x={x} y={y - 5}>
                  <path d="M10.469,39.925l-10.432,18.074l10.432,18.083l10.432,-18.083l-10.432,-18.074Z" style={{ fill: 'grey', fillRule: 'nonzero' }} />
                  <path d="M123.531,39.925l-10.432,18.074l10.432,18.083l10.432,-18.083l-10.432,-18.074Z" style={{ fill: 'grey', fillRule: 'nonzero' }} />
                  <path d="M23.085,97.921l10.432,18.078l20.87,0l-10.438,-18.078l-20.864,0Z" style={{ fill: 'grey', fillRule: 'nonzero' }} />
                  <path d="M79.616,0.003l10.428,18.073l20.874,0l-10.437,-18.073l-20.865,0Z" style={{ fill: 'grey', fillRule: 'nonzero' }} />
                  <path d="M79.612,116l20.865,-0.02l10.442,-18.063l-20.875,0.005l-10.432,18.078Z" style={{ fill: 'grey', fillRule: 'nonzero' }} />
                  <path d="M23.085,18.078l20.864,0l10.438,-18.074l-20.87,0l-10.432,18.074Z" style={{ fill: 'grey', fillRule: 'nonzero' }} />
                </svg>
                <text x={x + 15} y={y + 30} className={className}>{label}</text>
              </g>
              :
              <text x={x + 15} y={y + 30} className={className}>{label}</text>
      }
    </g>
  );
}

export function makeHexComponent({ map, todoRenameThis, coordText, x, y, inRange }) {
  const hexInfo = MAPS[map][coordText];
  const key = `${map}${coordText}`;
  const otherProps = { inRange, todoRenameThis, key, coordText, x, y };

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
