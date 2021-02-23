import { useEffect } from "react"

export default function ClueDisplay({ G: { clue, promptNoise, }, ctx: { turn, currentPlayer, gameover, }, playerID, }) {
  const text = gameover ?
    `Winner(s) are ${gameover.winner}`
    : (promptNoise && currentPlayer === playerID) ?
      'Select any sector to make a noise there'
      : clue

  // useEffect(() => {
  //   if (clue && playerID === '0') { // TODO remove playerID checkd
  //     // for some reason `speechSynthesis.speak(new SpeechSynthesisUtterance('I08'))` or with any other number gets pronounced weirdly on my phone...
  //     const utterance = new SpeechSynthesisUtterance(text.replace('I0', 'I 0 '))
  //     // const voice = speechSynthesis.getVoices()
  //     speechSynthesis.cancel()
  //     speechSynthesis.speak(utterance)
  //   }
  // }, [clue, turn]) // depend on turn to use effect even when clue stays same between turns (eg. 2 silent sectors in a row)

  return (
    <h1>{text}</h1>
  )
}
