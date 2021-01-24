import { useState } from 'react';
import MapSelector from './MapSelector';
import Map from './Map';

export default function Game() {
  const [map, setMap] = useState('galilei');

  return (
    <div>
      <MapSelector map={map} setMap={setMap} />
      <Map map={map} />
    </div>
  );
}
