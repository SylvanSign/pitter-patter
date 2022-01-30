import './App.css'
import board from './Board'
import game from './Game'
import { Client } from 'boardgame.io/react'
import { SocketIO } from 'boardgame.io/multiplayer'

const App = Client({
  game,
  board,
  multiplayer: SocketIO({ server: `${window.location.hostname}:8000` }),
  debug: false,
})
export default App
