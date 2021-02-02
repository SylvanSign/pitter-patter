import './App.css'
import Board from './Board'
import Game from './GamePure'
import { Client } from 'boardgame.io/react'
import { EffectsBoardWrapper, useEffectState } from 'bgio-effects/react';
import { BoardComponent } from './Board';

// TODO remove this wrapper stuff when we switch to Multiplayer
function wrapGameDefinition(game) {
  return setupData => ({
    ...game,
    setup: ctx => game.setup(ctx, setupData)
  })
}
const wrappedGameDef = wrapGameDefinition(Game)

function FakeBoard(props) {
  const [move, isMoving] = useEffectState('move', 'silence');
  return <h1 style={{ color: isMoving ? 'red' : 'black' }}> {move}</h1 >
}

const App = Client({
  game: wrappedGameDef({ map: 'galilei' }),
  board: EffectsBoardWrapper(FakeBoard), // TODO
  numPlayers: 2, // TODO multiplayer
})

export default App
