import Tile from './Tile'
import Modal from './Modal'
import { cartesianToId } from './maps/util'
import { useEffect, useState, } from 'react'
import { useSessionStorageState } from './hooks'

export default function Map({ G, playerID, moves, grid, fullGrid, Grid, corners, ctx: { currentPlayer, }, }) {
  const [notes, setNotes] = useSessionStorageState('notes', {})
  const [modal, setModal] = useState({ id: null, comp: '' })

  // we don't pass setNotes to deps array because it will never change
  useEffect(() => {
    setNotes(notes => {
      return { ...notes, [G.noise]: true }
    })
  }, [G.noise, setNotes])

  const { map, promptNoise, } = G
  const self = G.players[playerID || 0] // TODO shouldn't need the || 0 except for local testing
  function close() {
    setModal({ id: null, comp: '' })
  }

  function onClick({ clientX, clientY }) {
    const svg = document.getElementById(`map${playerID}`)
    const point = svg.createSVGPoint() // TODO should this be done once, outside of click handler?

    point.x = clientX
    point.y = clientY

    // The cursor point, translated into svg coordinates
    const { x, y } = point.matrixTransform(svg.getScreenCTM().inverse())
    const hexCoordinates = Grid.pointToHex(x, y)
    const hex = grid.get(hexCoordinates)

    if (hex) {
      handleClick(hex, promptNoise)
    }
  }

  function handleClick(hex, promptNoise) {
    if (promptNoise && playerID === currentPlayer) {
      moves.noise(hex)
    } else {
      if (hex && hex.accessible && !G.escapes[hex.type]) {
        if (hex.id === modal.id) { // clicking already open hex will close it
          close()
        } else if (!!self.reachable.find(r => r.id === hex.id)) { // reachable
          setModal({ id: hex.id, comp: <Modal {...{ self, moves, hex, fullGrid, close, setNotes, }} /> })
        } else if (!modal.id && typeof hex.type !== 'number') {
          // quick notes
          setNotes(notes => {
            return { ...notes, [hex.id]: !notes[hex.id] }
          })
        } else {
          close() // if modal is already open, let it close before taking quick notes
        }
      } else {
        close()
      }
    }
  }

  const hexSVGs = grid.map(hex => {
    const { x, y } = hex.toPoint()
    const cartesian = hex.coordinates()
    const id = cartesianToId(cartesian.x, cartesian.y)

    const current = self.hex.id === id && !self.dead
    const moveCandidate = !!self.reachable.find(r => r.id === hex.id)
    const hasNote = notes[id]
    const status = G.escapes[hex.type]
    return <Tile {...{ key: id, current, moveCandidate, hasNote, map, id, x, y, status, }} />
  })

  const points = corners.map(({ x, y }) => `${x},${y}`).join(' ')
  return (
    // TODO remove these debugging styles
    // <svg style={{ border: '1px dotted white' }} id={`map${playerID}`} onClick={onClick} viewBox={`0 0 ${fullGrid.pointWidth()} ${fullGrid.pointHeight()}`}>
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
        <pattern id="stars" width="420" height="420" patternUnits="userSpaceOnUse">
          <svg xmlns="http://www.w3.org/2000/svg">
            <filter id="filter">
              <feTurbulence seed="4815162342" baseFrequency="0.2" />
              <feColorMatrix values="0 0 0 9 -4
                                     0 0 0 9 -4
                                     0 0 0 9 -4
                                     0 0 0 9 1"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#filter)" />
          </svg>
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#stars)' />
      {hexSVGs}
      {modal.comp}
    </svg>
  )
}

export function MapArt({ grid, fullGrid, map, corners }) {
  const hexSVGs = grid.map(hex => {
    const { x, y } = hex.toPoint()
    const cartesian = hex.coordinates()
    const id = cartesianToId(cartesian.x, cartesian.y)

    return <Tile {...{ key: id, map, id, x, y, }} />
  })

  const points = corners.map(({ x, y }) => `${x},${y}`).join(' ')
  return (
    <svg viewBox={`0 0 ${fullGrid.pointWidth()} ${fullGrid.pointHeight()}`}>
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
        <pattern id="stars" width="420" height="420" patternUnits="userSpaceOnUse">
          <svg xmlns="http://www.w3.org/2000/svg">
            <filter id="filter">
              <feTurbulence seed="4815162342" baseFrequency="0.2" />
              <feColorMatrix values="0 0 0 9 -4
                                     0 0 0 9 -4
                                     0 0 0 9 -4
                                     0 0 0 9 1"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#filter)" />
          </svg>
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#stars)' />
      {hexSVGs}
    </svg>
  )
}
