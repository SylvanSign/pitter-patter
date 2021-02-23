export default function RoundDisplay({ ctx: { gameover, }, G: { round, } }) {
  const text = gameover ? 'Game Over!' : `Round ${round}`
  return (
    <h1>{text}</h1>
  )
}
