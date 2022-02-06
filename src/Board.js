import Map from './Map'
import RoundDisplay from './RoundDisplay'
import ClueDisplay from './ClueDisplay'
import Inventory from './Inventory'
import gridGenerator from './maps/gridGenerator'

export default function Game(props) { // props from boardgame.io/react
  return (
    <div>
      {/* TODO add MapSelector somehow? */}
      <RoundDisplay {...props} />
      <Inventory {...props} />
      <Map {...props} {...gridGenerator(props.G.map)} />
      <ClueDisplay {...props} />
    </div >
  )
}
