import { useState } from 'react';
import MapSelector from './MapSelector';
import Map from './Map';

export default function Game() {
  const [map, setMap] = useState('galilei');

  return (
    <div>
      <div>
        <MapSelector map={map} setMap={setMap} />
      </div>
      <Map map={map} />
    </div>
  );
}
