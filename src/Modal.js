export default function Modal({ self, moves, hex, x, y, close, }) {
  const move = self.reachable.has(hex) ? <Move {...{ moves, hex, close, }} /> : ''
  return (
    <g transform={`translate(${x} ${y})`} onClick={e => e.stopPropagation()}>
      <rect width="120" height="100" rx="0" fill="white" stroke="black" />
      <X close={close} />
      <Id id={hex.id} />
      <Mark />
      {move}
    </g>
  )
}

function X({ close, }) {
  return (
    <g transform={`translate(100 0)`} onClick={close}>
      <rect width='20' height="20" rx="0" fill="none" stroke="black" />
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
      <rect width='50' height="30" rx="10" fill="none" stroke="black" />
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
      <rect width='50' height="30" rx="10" fill="none" stroke="black" />
      <text x='5' y='20'>Move</text>
    </g>
  )
}
