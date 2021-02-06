import Tile from './Tile'
import Modal from './Modal'
import { cartesianToId } from './maps/util'
import { useState, } from 'react'

export default function Map({ G, G: { map, gridData, }, playerID, moves, }) {
  const [modal, setModal] = useState('')
  const self = G.players[playerID]
  const {
    grid,
    fullGrid,
    Grid,
    corners,
  } = gridData

  function onClick({ clientX, clientY }) {
    const svg = document.getElementById(`map${playerID}`)
    const point = svg.createSVGPoint(); // TODO should this be done once, outside of click handler?

    point.x = clientX
    point.y = clientY

    // The cursor point, translated into svg coordinates
    const { x, y } = point.matrixTransform(svg.getScreenCTM().inverse())
    const hexCoordinates = Grid.pointToHex(x, y)
    const hex = grid.get(hexCoordinates)
    if (hex) {
      console.log(hex)
      const { x: mx, y: my, } = hex.toPoint()
      setModal(<Modal {...{ self, moves, hex, x: mx, y: my, close: () => setModal('') }} />)
    } else {
      setModal('')
    }
  }

  const hexSVGs = grid.map(hex => {
    const { x, y } = hex.toPoint()
    const cartesian = hex.cartesian()
    const id = cartesianToId(cartesian.x, cartesian.y)

    const current = self.hex.id === id
    const moveCandidate = self.reachable.has(hex)
    return <Tile {...{ key: id, current, moveCandidate, map, id, x, y }} />
  })

  return (
    <svg id={`map${playerID}`} onClick={onClick} viewBox={`0 0 ${fullGrid.pointWidth()} ${fullGrid.pointHeight()}`}>
      <defs>
        <symbol id='hex'>
          <polygon points={corners.map(({ x, y }) => `${x},${y}`).join(' ')} stroke='grey' strokeWidth='2' />
        </symbol>
        <pattern id="stripes" width="10" height="10" patternTransform="rotate(-40 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="10" stroke='darkgrey' strokeWidth='1.5' />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='white' />
      <rect width='100%' height='100%' fill='url(#stripes)' />
      {hexSVGs}
      {modal}
    </svg>
  )
}
