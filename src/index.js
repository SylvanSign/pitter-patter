import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from "react-router-dom"
import './index.css'
import App from './App'
import Home from './Home'
// enable Immer MapSet support for reachable hex stuff
import { enableMapSet } from "immer"
enableMapSet()

ReactDOM.render(
  <React.StrictMode>
    <Home />
    {/* <App />  */}
  </React.StrictMode>,
  document.getElementById('root')
)
