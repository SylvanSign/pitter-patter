import { useEffect } from "react"
import { EMOJIS } from "./emojis"

export default function RoundDisplay({ ctx: { gameover, currentPlayer, }, G: { kitteh, round, players, promptNoises, promptSpotlight }, matchData, playerID }) {
  const promptingNoiseForYou = (promptNoises && currentPlayer === playerID)
  const promptingSpotlightForYou = (promptSpotlight && currentPlayer === playerID)
  const role = players[playerID].role

  useEffect(() => {
    if (promptingNoiseForYou)
      if (promptNoises === 1)
        if (kitteh)
          alert('You made a noise in you sector, but you can Click any dangerous sector to have your CAT make a noise there') // TODO better UI for this :)
        else
          alert('Click any dangerous sector to make a noise there') // TODO better UI for this :)
      else
        alert('Click any 2 dangerous sectors to make noises there') // TODO better UI for this :)
    // disable ESlint here because we don't want to depend on promptNoises
    // eslint-disable-next-line
  }, [promptingNoiseForYou, kitteh])

  useEffect(() => {
    if (promptingSpotlightForYou)
      alert('Click any sector to shine spotlight there') // TODO better UI for this :)
  }, [promptingSpotlightForYou])

  return (
    gameover
      ? <h2 className="centered">Game Over! {gameoverText(gameover.winner, matchData)}</h2>
      : <h2 className="centered">Round {round} · You are {EMOJIS[role]}</h2>

  )
}

export function gameoverText(winners, matchData) {
  switch (winners.length) {
    case 0:
      return 'Aliens killed all the humans!'
    case 1:
      return `Only ${renderWinners(winners, matchData)} got out alive!`
    default:
      return `${renderWinners(winners, matchData)} got out alive!`
  }
}

function renderWinners(winners, matchData) {
  return winners.map(w => matchData.find(e => e.id === w).name).join(', ')
}
