export default function Modal({ self, moves, fullGrid, hex, close, }) {
  // TODO delete
  window.hex = hex
  window.fullGrid = fullGrid
  // TODO end delete
  const [note, move, hunt] = fullGrid.neighborsOf(hex, ['S', 'SE', 'NE'])
  return (
    <g>
      <Note hex={note} />
      <Move hex={move} />
      {/* <Hunt hex={hunt} /> */}
      <Highlight hex={hex} />
    </g>
  )
}

function Note({ hex }) {
  const text = <text x={10} y={30} className='menu'>NOTE</text>
  return <ModalHex {...{ hex, text, }} />
}

function Move({ hex }) {
  const text = <text x={10} y={30} className='menu'>MOVE</text>
  return <ModalHex {...{ hex, text, }} />
}

function Hunt({ hex }) {
  const text = <text x={10} y={30} className='menu'>HUNT</text>
  return <ModalHex {...{ hex, text, }} />
}

function Highlight({ hex }) {
  const { x, y } = hex.toPoint()
  return (
    <g transform={`translate(${x} ${y})`}>
      <use xlinkHref='#highlight' className='highlight' />
    </g>
  )
}

function ModalHex({ hex, text }) {
  const { x, y } = hex.toPoint()
  return (
    <g transform={`translate(${x} ${y})`}>
      <use xlinkHref='#highlight' className='menu' />
      {text}
    </g>
  )
}
