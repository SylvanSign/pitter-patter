import Tile from './Tile'
import Modal from './Modal'
import { cartesianToId } from './maps/util'
import { useEffect, useState, } from 'react'
import { useSessionStorageState } from './hooks'

export default function Map({ G, playerID, moves, grid, fullGrid, Grid, corners, ctx: { currentPlayer, }, }) {
  const [noises, setNoises] = useSessionStorageState('noises', {})
  const [notes, setNotes] = useSessionStorageState('notes', {})
  const [modal, setModal] = useState({ id: null, comp: '' })

  // TODO do people actually like this auto-noter for noises?
  //      or is it more fun manually?
  useEffect(() => {
    setNotes(currentNotes => {
      return { ...currentNotes, [G.noise1]: true }
    })
  }, [G.noise1, G.action, setNotes])
  useEffect(() => {
    setNotes(currentNotes => {
      return { ...currentNotes, [G.noise2]: true }
    })
  }, [G.noise2, G.action, setNotes])

  const { map, promptNoises, promptSpotlight } = G
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
      handleClick(hex, promptNoises, promptSpotlight)
    }
  }

  function handleClick(hex, promptNoises, promptSpotlight) {
    if (promptNoises && playerID === currentPlayer) {
      moves.noise(hex)
    } else if (promptSpotlight && playerID === currentPlayer) {
      moves.shineSpotlight(hex)
    } else {
      if (hex && !G.escapes[hex.type]) {
        if (hex.id === modal.id) { // clicking already open hex will close it
          close()
        } else if (!!self.reachable.find(r => r.id === hex.id)) { // reachable
          setModal({ id: hex.id, comp: <Modal {...{ self, sedated: G.sedated, role: G.players[playerID].role, hand: G.players[playerID].hand, moves, hex, fullGrid, close, setNotes, }} /> })
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

    const current = self.hex.id === id && !self.gone
    const moveCandidate = !!self.reachable.find(r => r.id === hex.id)
    const hasNote = notes[id]
    const hasNoise = noises[id]
    const status = G.escapes[hex.type]
    return <Tile {...{ key: id, current, moveCandidate, hasNote, hasNoise, map, id, x, y, status, }} />
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
          <polygon points={points} stroke='red' strokeWidth='5' fill='none' transform='scale(0.6) translate(20 20)' />
        </symbol>
        <symbol id='noise'>
          <polygon points={points} stroke='purple' strokeWidth='5' fill='none' transform='scale(0.6) translate(20 20)' />
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
          <polygon points={points} stroke='red' strokeWidth='5' fill='none' transform='scale(0.75) translate(10 10)' />
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
