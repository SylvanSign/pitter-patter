import './App.css'
import board from './Board'
import game from './Game'
import { Client } from 'boardgame.io/react'
import { SocketIO } from 'boardgame.io/multiplayer'
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT || 8000
const App = Client({
  game,
  board,
  multiplayer: SocketIO({ server: `${window.location.hostname}:${SERVER_PORT}` }),
  debug: false,
})
export default App
