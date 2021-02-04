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

const App = Client({
  game: wrappedGameDef({ map: 'galilei' }),
  board: Board,
  numPlayers: 2, // TODO multiplayer
})

export default App
