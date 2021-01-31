import Map from './Map';

export default function Game(props) { // props from boardgame.io/react
  return (
    <div>
      {/* TODO add MapSelector somehow? */}
      <Map {...props} />
    </div>
  );
}
