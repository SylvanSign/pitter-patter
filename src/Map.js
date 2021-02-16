import Tile from './Tile'
import Modal from './Modal'
import { cartesianToId } from './maps/util'
import { useState, } from 'react'

export default function Map({ G, playerID, moves, grid, fullGrid, Grid, corners }) {
  const [notes, setNotes] = useState({})
  const [modal, setModal] = useState({ id: null, comp: '' })

  const { map, promptNoise, } = G
  const self = G.players[playerID]
  function close() {
    setModal({ id: null, comp: '' })
  }

  function onClick({ clientX, clientY }) {
    const svg = document.getElementById(`map${playerID}`)
    const point = svg.createSVGPoint(); // TODO should this be done once, outside of click handler?

    point.x = clientX
    point.y = clientY

    // The cursor point, translated into svg coordinates
    const { x, y } = point.matrixTransform(svg.getScreenCTM().inverse())
    const hexCoordinates = Grid.pointToHex(x, y)
    const hex = grid.get(hexCoordinates)

    handleClick(hex, promptNoise)
  }

  function handleClick(hex, promptNoise) {
    if (promptNoise) {
      moves.noise(hex)
    } else {
      if (hex && hex.accessible) {
        if (hex.id === modal.id) { // clicking already open hex will close it
          close()
        } else {
          setModal({ id: hex.id, comp: <Modal {...{ self, moves, hex, fullGrid, close, setNotes, }} /> })
        }
      } else {
        close()
      }
    }
  }

  console.log(self.reachable)
  const hexSVGs = grid.map(hex => {
    const { x, y } = hex.toPoint()
    const cartesian = hex.coordinates()
    const id = cartesianToId(cartesian.x, cartesian.y)

    const current = self.hex.id === id && !self.dead
    const moveCandidate = !!self.reachable.find(r => r.id === hex.id)
    const hasNote = notes[id]
    const status = hex.status
    return <Tile {...{ key: id, current, moveCandidate, hasNote, map, id, x, y, status, }} />
  })

  const points = corners.map(({ x, y }) => `${x},${y}`).join(' ')
  return (
    <svg id={`map${playerID}`} onClick={onClick} viewBox={`0 0 ${fullGrid.pointWidth()} ${fullGrid.pointHeight()}`}>
      <defs>
        <symbol id='hex'>
          <polygon points={points} stroke='grey' strokeWidth='2' />
        </symbol>
        <symbol id='highlight'>
          <polygon points={points} stroke='gold' strokeWidth='3' />
        </symbol>
        <symbol id='note'>
          <polygon points={points} stroke='red' strokeWidth='5' fill='none' transform='scale(0.6) translate(19 16)' />
        </symbol>
        {/* <symbol id='note'>
          <text x={corners[0].x - 35} y={corners[0].y + 5}>?</text>
        </symbol> */}
        <pattern id="stripes" width="10" height="10" patternTransform="rotate(-40 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="10" stroke='darkgrey' strokeWidth='1.5' />
        </pattern>
      </defs>
      {/* <rect width='100%' height='100%' fill='white' /> */}
      <rect width='100%' height='100%' fill='url(#stripes)' />
      {hexSVGs}
      {modal.comp}
    </svg>
  )
}
