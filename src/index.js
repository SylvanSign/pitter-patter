import React from 'react'
import ReactDOM from 'react-dom'
// import './index.css' // TODO re-add this?
import App from './App'
// enable Immer MapSet support for reachable hex stuff
import { enableMapSet } from "immer"
enableMapSet()

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
