import './App.css'
import Board from './Board'
import Game from './GamePure'
import { Client } from 'boardgame.io/react'

const App = Client({
  game: Game,
  // board: Board,
  numPlayers: 3, // TODO multiplayer
})

export default App
