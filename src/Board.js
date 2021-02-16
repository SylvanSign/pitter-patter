import Map from './Map'
import ClueDisplay from './ClueDisplay'
import { useEffect } from 'react'
import { gridData } from './Game'

export default function Game(props) { // props from boardgame.io/react
  const gameOver = props.ctx.gameover
  useEffect(() => {
    if (gameOver) {
      alert(`Winner is ${gameOver.winner}`)
    }
  }, [gameOver])

  return (
    <div>
      {/* TODO add MapSelector somehow? */}
      <Map {...props} {...gridData} />
      <ClueDisplay {...props} />
    </div>
  )
}
