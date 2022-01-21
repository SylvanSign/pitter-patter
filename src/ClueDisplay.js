import { useEffect } from "react"

export default function ClueDisplay({ G: { round, clue, promptNoise, }, ctx: { currentPlayer, gameover, }, playerID, }) {
  const text = gameover ?
    gameoverText(gameover.winner)
    : (promptNoise && currentPlayer === playerID) ?
      'Select any sector to make a noise there'
      : clue

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
    <h1>{text}</h1>
  )
}

function gameoverText(winners) {
  switch (winners.length) {
    case 0:
      return 'Not a single human survived!'
    case 1:
      return `Only human ${winners[0]} got out alive!`
    default:
      return `Humans ${winners} got out alive!`
  }
}
