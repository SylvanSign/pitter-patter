export default function RoundDisplay({ ctx: { gameover, currentPlayer, }, G: { round, players, promptNoise, }, matchData, playerID }) {
  const promptingNoiseForYou = (promptNoise && currentPlayer === playerID)
  const role = players[playerID].role
  const color = role === 'human' ? 'green' : 'purple'

  return (
    gameover
      ? <h2 className="centered">Game Over! {gameoverText(gameover.winner, matchData)}</h2>
      : promptingNoiseForYou
        ? <h2 className="centered">Select any dangerous sector to make a noise there</h2>
        : <h2 className="centered">Round {round} · You are <span style={{ color }}>{role}</span></h2>

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
