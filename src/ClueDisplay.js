import { useEffect } from "react"
import { gameoverText } from "./RoundDisplay"

export default function ClueDisplay({ G: { round, clues, promptNoise, }, ctx: { gameover, currentPlayer, }, playerID, matchData }) {
  const text =
    (promptNoise && currentPlayer === playerID)
      ? 'Select any dangerous sector to make a noise there'
      : renderClue(clues, matchData)

  // TODO checkbox to enable this or something?
  useEffect(() => {
    if (clues) {
      // for some reason `speechSynthesis.speak(new SpeechSynthesisUtterance('I08'))` or with any other number gets pronounced weirdly on my phone...
      let readText = text.replace('I0', 'I 0 ')
      if (gameover)
        readText += `. Game Over! ${gameoverText(gameover.winner, matchData)}`
      const utterance = new SpeechSynthesisUtterance(readText)
      // const voice = speechSynthesis.getVoices()
      speechSynthesis.cancel()
      speechSynthesis.speak(utterance)
    }
  }, [clues, gameover, matchData, text, round]) // depend on round to use effect even when clue stays same between rounds (eg. 2 silent sectors in a row)

  return (
    <h2 className="centered">{text}</h2>
  )
}

function renderClue(clues, matchData) {
  return clues
    .map(({ id, msg }) => msg.replace('NAME', matchData.find(e => e.id === id).name))
    .join(' ')
}
