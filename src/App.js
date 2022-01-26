import './App.css'
import Board from './Board'
import Game from './Game'
// import { Lobby } from 'boardgame.io/react'
import { Client } from 'boardgame.io/react'

// TODO remove this params stuff
const urlParams = new URLSearchParams(window.location.search)
const debug = urlParams.get('d') // enable debug with ?d=1

const App = Client({ game: Game, board: Board, debug: !!debug });

export default App;

// export default function App() {
//   return (
//     <Lobby
//       gameServer={`http://${window.location.hostname}:8000`}
//       lobbyServer={`http://${window.location.hostname}:8000`}
//       gameComponents={[
//         { game: Game, board: Board }
//       ]}
//       debug={!!debug}
//     />
//   )
// }
