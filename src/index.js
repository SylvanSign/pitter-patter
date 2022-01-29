import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Home from './Home'

// enable Immer MapSet support for reachable hex stuff
import { enableMapSet } from "immer"
enableMapSet()

ReactDOM.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
  document.getElementById('root')
)
