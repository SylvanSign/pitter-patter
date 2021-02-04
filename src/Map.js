import Tile from './Tile'
import { cartesianToId } from './maps/util'

export default function Map({ ctx, G, G: { map, gridData, }, moves, }) {
  const {
    grid,
    fullGrid,
    Grid,
    corners,
  } = gridData

  function onClick({ clientX, clientY }) {
    const svg = document.getElementById('map')
    const point = svg.createSVGPoint(); // TODO should this be done once, outside of click handler?

    point.x = clientX
    point.y = clientY

    // The cursor point, translated into svg coordinates
    const { x, y } = point.matrixTransform(svg.getScreenCTM().inverse())
    const hexCoordinates = Grid.pointToHex(x, y)
    const hex = grid.get(hexCoordinates)
    if (hex) {
      moves.move(hex)
    }
  }

  const hexSVGs = grid.map(hex => {
    const { x, y } = hex.toPoint()
    const cartesian = hex.cartesian()
    const id = cartesianToId(cartesian.x, cartesian.y)

    const currentPlayer = G.players[ctx.currentPlayer]
    const current = currentPlayer.hex.id === id
    const moveCandidate = currentPlayer.reachable.has(hex)
    return <Tile {...{ key: id, current, moveCandidate, map, id, x, y }} />
  })

  return (
    <svg id='map' onClick={onClick} viewBox={`0 0 ${fullGrid.pointWidth()} ${fullGrid.pointHeight()}`}>
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
    </svg>
  )
}
