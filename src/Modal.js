export default function Modal({ id, x, y, }) {
  return (
    <g transform={`translate(${x} ${y})`} onClick={e => e.stopPropagation()}>
      <rect width="120" height="100" rx="10" fill="white" stroke="black" />
      <Id id={id} />
      <Mark />
      <Move />
    </g>
  )
}

function Id({ id, }) {
  return (
    <g transform={`translate(45 0)`}>
      <text x='5' y='20'>{id}</text>
    </g>
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

function Move() {
  function onClick(e) {
    e.stopPropagation()
    alert('Move')
  }

  return (
    <g transform={`translate(55 50)`} onClick={onClick}>
      <rect width='50' height="30" rx="10" fill="none" stroke="black" />
      <text x='5' y='20'>Move</text>
    </g>
  )
}
