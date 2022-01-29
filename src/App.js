import './App.css'
import board from './Board'
import game from './Game'
import { Client } from 'boardgame.io/react'

const App = Client({ game, board });
export default App;
