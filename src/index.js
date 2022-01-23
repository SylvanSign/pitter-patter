import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Home from './Home'
// enable Immer MapSet support for reachable hex stuff
import { enableMapSet } from "immer"
enableMapSet()

ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    <Home />
  </React.StrictMode>,
  document.getElementById('root')
)
