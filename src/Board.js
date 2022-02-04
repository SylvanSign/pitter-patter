import Map from './Map'
import RoundDisplay from './RoundDisplay'
import ClueDisplay from './ClueDisplay'
import gridGenerator from './maps/gridGenerator'

export default function Game(props) { // props from boardgame.io/react
  return (
    <div>
      {/* TODO add MapSelector somehow? */}
      <RoundDisplay {...props} />
      <Map {...props} {...gridGenerator(props.G.map)} />
      <ClueDisplay {...props} />
    </div >
  )
}

function AudioPlayer() {
  const [src, setSrc] = useState()

  return (
    <audio src={src}></audio>
  )
}
