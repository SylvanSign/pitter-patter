export default function Modal({ self, moves, hex, x, y, close, }) {
  const move = self.reachable.has(hex) ? <Move {...{ moves, hex, close, }} /> : ''
  return (
    <g transform={`translate(${x} ${y})`} onClick={e => e.stopPropagation()}>
      <rect width="120" height="100" rx="0" fill="white" stroke="black" />
      <Id id={hex.id} />
      <Mark />
      {move}
      <X close={close} />
    </g>
  )
}

function HexShape({ className, x, y, current, moveCandidate }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <use xlinkHref='#hex' className={className} />
    </g>
  )
}

function X({ close, }) {
  function onClick(e) {
    e.stopPropagation()
    close()
  }
  return (
    <g transform={`translate(100 0)`} onClick={onClick}>
      <rect width='20' height="20" rx="0" fill="white" stroke="black" />
      <text x='5' y='15'>X</text>
    </g>
  )
}

function Id({ id, }) {
  return (
    <text x='5' y='20'>{id}</text>
  )
}

function Mark() {
  function onClick(e) {
    e.stopPropagation()
    alert('Mark')
  }

  return (
    <g transform={`translate(5 50)`} onClick={onClick}>
      <rect width='50' height="30" rx="0" fill="white" stroke="black" />
      <text x='5' y='20'>Mark</text>
    </g>
  )
}

function Move({ moves, hex, close, }) {
  function onClick(e) {
    e.stopPropagation()
    close()
    moves.move(hex)
  }

  return (
    <g transform={`translate(55 50)`} onClick={onClick}>
      <rect width='50' height="30" rx="0" fill="none" stroke="black" />
      <text x='5' y='20'>Move</text>
    </g>
  )
}
