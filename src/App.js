import './App.css'
import Board from './Board'
import Game from './Game'
import { Client } from 'boardgame.io/react'
import { Local } from 'boardgame.io/multiplayer';

// TODO remove this wrapper stuff when we switch to Multiplayer
function wrapGameDefinition(game) {
  return setupData => ({
    ...game,
    setup: ctx => game.setup(ctx, setupData)
  })
}
const wrappedGameDef = wrapGameDefinition(Game)

const C = Client({
  game: wrappedGameDef({ map: 'galilei' }),
  board: Board,
  multiplayer: Local(),
  debug: false,
})

export default function App() {
  return (
    <div>
      <C playerID='0' />
      <C playerID='1' />
    </div>
  )
}
