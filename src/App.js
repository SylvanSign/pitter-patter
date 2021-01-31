import './App.css';
import Board from './Board';
import PitterPatter from './PitterPatter';
import { Client } from 'boardgame.io/react';

const App = Client({
  game: PitterPatter,
  board: Board,
});

export default App;
