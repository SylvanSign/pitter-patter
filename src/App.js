import './App.css';
import Board from './Board';
import Game from './Game';
import { Client } from 'boardgame.io/react';

const App = Client({
  game: Game,
  board: Board,
  numPlayers: 1, // TODO multiplayer
});

export default App;
