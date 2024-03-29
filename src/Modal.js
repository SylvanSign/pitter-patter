import { HEX_TYPES } from './maps/util'

export default function Modal({ self, hand, role, sedated, moves, fullGrid, hex, close, setNotes, }) {
  const escape = typeof hex.type === 'number'

  if (escape && self.role === 'alient') {
    return null
  }

  const [
    note,
    move,
    attack,
  ] = fullGrid.neighborsOf(hex).filter(n => n)
  const moveComp = <Move {...{ place: move, sedated, hex, moves, close, hand, role }} />
  const attackComp = self.role === 'alien' || hand.attack ? <Attack {...{ place: attack, role: self.role, hex, moves, close }} /> : ''
  const noteComp = escape ? '' : <Note {...{ place: note, hex, close, setNotes }} />

  return (
    <g onClick={e => e.stopPropagation()}>
      {noteComp}
      {moveComp}
      {attackComp}
      <Highlight place={hex} />
    </g>
  )
}

function Note({ place, hex, close, setNotes, }) {
  function onClick() {
    close()
    setNotes(notes => {
      return { ...notes, [hex.id]: !notes[hex.id] }
    })
  }
  const tooltip = 'TOGGLE MARKER'
  const svg = (
    <path stroke='black' fill='black' d="M39.62,64.58c-1.46,0-2.64-1.41-2.64-3.14c0-1.74,1.18-3.14,2.64-3.14h34.89c1.46,0,2.64,1.41,2.64,3.14 c0,1.74-1.18,3.14-2.64,3.14H39.62L39.62,64.58z M46.77,116.58c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15H7.33 c-2.02,0-3.85-0.82-5.18-2.15C0.82,119.4,0,117.57,0,115.55V7.33c0-2.02,0.82-3.85,2.15-5.18C3.48,0.82,5.31,0,7.33,0h90.02 c2.02,0,3.85,0.83,5.18,2.15c1.33,1.33,2.15,3.16,2.15,5.18v50.14c0,1.74-1.41,3.15-3.15,3.15c-1.74,0-3.15-1.41-3.15-3.15V7.33 c0-0.28-0.12-0.54-0.31-0.72c-0.19-0.19-0.44-0.31-0.72-0.31H7.33c-0.28,0-0.54,0.12-0.73,0.3C6.42,6.8,6.3,7.05,6.3,7.33v108.21 c0,0.28,0.12,0.54,0.3,0.72c0.19,0.19,0.45,0.31,0.73,0.31H46.77L46.77,116.58z M98.7,74.34c-0.51-0.49-1.1-0.72-1.78-0.71 c-0.68,0.01-1.26,0.27-1.74,0.78l-3.91,4.07l10.97,10.59l3.95-4.11c0.47-0.48,0.67-1.1,0.66-1.78c-0.01-0.67-0.25-1.28-0.73-1.74 L98.7,74.34L98.7,74.34z M78.21,114.01c-1.45,0.46-2.89,0.94-4.33,1.41c-1.45,0.48-2.89,0.97-4.33,1.45 c-3.41,1.12-5.32,1.74-5.72,1.85c-0.39,0.12-0.16-1.48,0.7-4.81l2.71-10.45l0,0l20.55-21.38l10.96,10.55L78.21,114.01L78.21,114.01 z M39.62,86.95c-1.46,0-2.65-1.43-2.65-3.19c0-1.76,1.19-3.19,2.65-3.19h17.19c1.46,0,2.65,1.43,2.65,3.19 c0,1.76-1.19,3.19-2.65,3.19H39.62L39.62,86.95z M39.62,42.26c-1.46,0-2.64-1.41-2.64-3.14c0-1.74,1.18-3.14,2.64-3.14h34.89 c1.46,0,2.64,1.41,2.64,3.14c0,1.74-1.18,3.14-2.64,3.14H39.62L39.62,42.26z M24.48,79.46c2.06,0,3.72,1.67,3.72,3.72 c0,2.06-1.67,3.72-3.72,3.72c-2.06,0-3.72-1.67-3.72-3.72C20.76,81.13,22.43,79.46,24.48,79.46L24.48,79.46z M24.48,57.44 c2.06,0,3.72,1.67,3.72,3.72c0,2.06-1.67,3.72-3.72,3.72c-2.06,0-3.72-1.67-3.72-3.72C20.76,59.11,22.43,57.44,24.48,57.44 L24.48,57.44z M24.48,35.42c2.06,0,3.72,1.67,3.72,3.72c0,2.06-1.67,3.72-3.72,3.72c-2.06,0-3.72-1.67-3.72-3.72 C20.76,37.08,22.43,35.42,24.48,35.42L24.48,35.42z" />
  )
  return <ModalHex {...{ place, svg, tooltip, onClick, }} />
}

function Move({ place, sedated, hex, close, moves, hand, role }) {
  function onClick() {
    close()
    if (
      role === 'human'
      && hand.cat
      && hex.type === HEX_TYPES.danger
      && !sedated
      && window.confirm('Do you want to use CAT now?')
    )
      moves.cat(hex)
    else
      moves.move(hex)
  }
  const tooltip = 'MOVE'
  const svg = (
    <path stroke='black' fill='black' d="M8.31,108.22c4.77-0.44,18.07-1.58,22.24-8.01c0.42-0.65,3.9-6.42,3.9-6.45l14.36,5.47c0.31,1.57-8.11,13.33-9.64,14.6 c-1.95,1.62-3.82,2.51-5.8,3.26c-6.65,2.5-12.37,4.52-19.91,5.79L8.31,108.22L8.31,108.22z M38.01,49.45l-6.14,22.24 c-1.46,7.19,0.12,13.28,6.89,17.48c3.53,2.19,4.52,2.08,8.56,3.25l18.65,4.28c1.11,0.25,23.27,18.19,25.35,19.98l9.57-8.62 c1.39-1.25-22.08-21.96-26.17-23.99c-19.42-9.63-20.24,1.38-12.93-26.41c3.71,3.62,6.52,7.66,13.56,10.42 c8.57,2.19,13.35-0.83,20.48-3.14l10.59-3.81l-4.57-12.91l-10.59,3.81c-0.3,0.1-1.06,0.38-2.39,0.84c-3.3,0.8-6.22,2.9-8.31,1.89 c-6.93-3.35-11.04-17.49-30.39-19.03c-2.91-0.23-8.32-0.96-12.54-1.08C21.94,33.74,16.59,39.62,8,48.44 c-3.95,3.82-4.01,3.78-8,7.57l10.15,10.1c4.02-3.82,4.11-3.8,8.09-7.66c3.61-3.45,6.08-7.01,9.79-8.53 c2.41-0.99,5.52-0.58,9.22-0.51C37.51,49.43,37.76,49.44,38.01,49.45L38.01,49.45L38.01,49.45z M56.12,0.73 c7.8-2.53,16.18,1.74,18.72,9.55c2.53,7.8-1.74,16.18-9.55,18.72c-7.8,2.53-16.18-1.74-18.72-9.55 C44.04,11.64,48.32,3.26,56.12,0.73L56.12,0.73z" />
  )
  return <ModalHex {...{ place, svg, tooltip, onClick, }} />
}

function Attack({ place, role, hex, close, moves, }) {
  function onClick() {
    close()
    if (role === 'alien') {
      moves.attack(hex)
    } else {
      moves.attackItem(hex)
    }
  }
  const tooltip = 'MOVE & ATTACK'
  const svg = (
    <polygon stroke='black' fill='black' points="0,70.16 21.75,84.72 6.56,42.05 29.34,64.41 26.46,12.31 54.57,53.75 57.23,27.28 65.44,50.26 79.8,0 80.83,56.62 93.54,42.05 91.9,61.95 122.88,32.21 102.16,93.54 122.47,86.57 109.14,109.14 86.87,109.14 91.29,84.9 74.91,100.7 72.4,83.16 69.3,92.87 63.49,82.1 62.32,93.57 48.72,76.59 48.97,102.36 37.13,92.65 38.56,109.14 18.5,109.14 0,70.16" />
  )
  return <ModalHex {...{ place, svg, tooltip, onClick, }} />
}

function Highlight({ place }) {
  const { x, y } = place.toPoint()
  return (
    <g transform={`translate(${x} ${y})`}>
      <use xlinkHref='#highlight' className='highlight' />
    </g>
  )
}

function ModalHex({ place, svg, tooltip, onClick, }) {
  const { x, y } = place.toPoint()
  return (
    <g transform={`translate(${x} ${y})`} onClick={onClick}>
      <title>{tooltip}</title>
      <use xlinkHref='#highlight' className='menu' />
      <svg width='40' height='40' x='10' y='5' viewBox="0 0 106.41 122.88">
        {svg}
      </svg>
    </g >
  )
}
