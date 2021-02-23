import Map from './Map'
import RoundDisplay from './RoundDisplay'
import ClueDisplay from './ClueDisplay'
import { useEffect } from 'react'
import { gridData } from './Game'

export default function Game(props) { // props from boardgame.io/react
  return (
    <div>
      {/* TODO add MapSelector somehow? */}
      <RoundDisplay {...props} />
      <Map {...props} {...gridData} />
      <ClueDisplay {...props} />
    </div >
  )
}
