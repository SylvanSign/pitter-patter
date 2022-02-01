// import { useEffect } from "react"

export default function ClueDisplay({ G: { round, clues, promptNoise, }, ctx: { currentPlayer, gameover, }, playerID, matchData }) {
  console.log(matchData)
  const text = gameover ?
    gameEnderDisplay(clues, gameover.winner, matchData)
    : (promptNoise && currentPlayer === playerID) ?
      'Select any dangerous sector to make a noise there'
      : renderClue(clues, matchData)

  // TODO checkbox to enable this or something?
  // useEffect(() => {
  //   if (clue) {
  //     // for some reason `speechSynthesis.speak(new SpeechSynthesisUtterance('I08'))` or with any other number gets pronounced weirdly on my phone...
  //     const utterance = new SpeechSynthesisUtterance(text.replace('I0', 'I 0 '))
  //     // const voice = speechSynthesis.getVoices()
  //     speechSynthesis.cancel()
  //     speechSynthesis.speak(utterance)
  //   }
  // }, [clue, round]) // depend on round to use effect even when clue stays same between rounds (eg. 2 silent sectors in a row)

  return (
    <h2 className="centered">{text}</h2>
  )
}

function gameEnderDisplay(clues, winners, matchData) {
  return `${renderClue(clues, matchData)}. ${gameoverText(winners, matchData)}`
}

function renderClue(clues, matchData) {
  return clues
    .map(({ id, msg }) => msg.replace('NAME', matchData.find(e => e.id === id).name))
    .join('. ')
}


function gameoverText(winners, matchData) {
  switch (winners.length) {
    case 0:
      return 'Aliens killed all the humans!'
    case 1:
      return `Human ${renderWinners(winners, matchData)} got out alive!`
    default:
      return `Humans ${renderWinners(winners, matchData)} got out alive!`
  }
}

function renderWinners(winners, matchData) {
  return winners.map(w => matchData.find(e => e.id === w).name).join(', ')
}
