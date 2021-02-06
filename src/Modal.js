export default function Modal({ self, moves, fullGrid, hex, close, }) {
  const [note, move, hunt] = fullGrid.neighborsOf(hex, ['S', 'SE', 'NE'])
  const moveComp = self.reachable.has(hex) ? <Move {...{ place: move, hex, moves, close }} /> : ''
  return (
    <g onClick={e => e.stopPropagation()}>
      <Note place={note} />
      {moveComp}
      {/* <Hunt place={hunt} hex={hex} /> */}
      <Highlight place={hex} />
    </g>
  )
}

function Note({ place, }) {
  return <ModalHex {...{ place, text: 'NOTE', }} />
}

function Move({ place, hex, close, moves, }) {
  function onClick(e) {
    e.stopPropagation()
    close()
    moves.move(hex)
  }
  return <ModalHex {...{ place, text: 'MOVE', onClick }} />
}

function Hunt({ place, hex, close, moves, }) {
  function onClick(e) {
    e.stopPropagation()
    close()
    moves.attack(hex)
  }
  return <ModalHex {...{ place, text: 'HUNT', }} />
}

function Highlight({ place }) {
  const { x, y } = place.toPoint()
  return (
    <g transform={`translate(${x} ${y})`}>
      <use xlinkHref='#highlight' className='highlight' />
    </g>
  )
}

function ModalHex({ place, text, onClick, }) {
  const { x, y } = place.toPoint()
  return (
    <g transform={`translate(${x} ${y})`} onClick={onClick}>
      <use xlinkHref='#highlight' className='menu' />
      <text x={10} y={30} className='menu'>{text}</text>
    </g>
  )
}
