import './App.css'
import Board from './Board'
import Game from './GamePure'
import { Client } from 'boardgame.io/react'

// TODO remove this wrapper stuff when we switch to Multiplayer
function wrapGameDefinition(game) {
  return setupData => ({
    ...game,
    setup: ctx => game.setup(ctx, setupData)
  })
}
const wrappedGameDef = wrapGameDefinition(Game)

function FakeBoard(props) {
  const winner = props.ctx.gameover ? <h1>Winner is {props.ctx.gameover.winner}</h1> : ''
  return (
    <div>
      <ul>
        {
          props.log
            .filter(l => l.action.type === 'MAKE_MOVE')
            .map(l => <li key={l._stateID}>{JSON.stringify(l)}</li>)
        }
      </ul>
      {winner}
    </div>
  )
}

const App = Client({
  game: wrappedGameDef({ map: 'galilei' }),
  // board: FakeBoard, // TODO
  board: Board, // TODO
  numPlayers: 2, // TODO multiplayer
})

export default App
