export default function RoundDisplay({ ctx: { gameover }, G: { round, }, matchData, }) {
  const text =
    gameover
      ? `Game Over! ${gameoverText(gameover.winner, matchData)}`
      : `Round ${round}`
  return (
    <h2 className="centered">{text}</h2>
  )
}

export function gameoverText(winners, matchData) {
  switch (winners.length) {
    case 0:
      return 'Aliens infected all the humans!'
    case 1:
      return `Only human ${renderWinners(winners, matchData)} got out alive!`
    default:
      return `Humans ${renderWinners(winners, matchData)} got out alive!`
  }
}

function renderWinners(winners, matchData) {
  return winners.map(w => matchData.find(e => e.id === w).name).join(', ')
}
