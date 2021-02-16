import './App.css'
import Board from './Board'
import Game from './Game'
import { Lobby } from 'boardgame.io/react'

// TODO remove this params stuff
const urlParams = new URLSearchParams(window.location.search);
const debug = urlParams.get('d'); // disable debug with ?d=1

export default function App() {
  return (
    <Lobby
      gameServer={`http://${window.location.hostname}:8000`}
      lobbyServer={`http://${window.location.hostname}:8000`}
      gameComponents={[
        { game: Game, board: Board }
      ]}
      debug={!!debug}
    />
  )
}
