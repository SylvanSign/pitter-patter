import { useEffect, useState } from "react"
// import { gameoverText } from "./RoundDisplay"
import AudioPlayer, { randSrc } from "./AudioPlayer"

export default function ClueDisplay({ G: { round, clues, event, promptNoise, }, ctx: { gameover, currentPlayer, }, playerID, matchData }) {
  const [src, setSrc] = useState(randSrc('start'))
  const promptingNoiseForYou = (promptNoise && currentPlayer === playerID)
  const text =
    promptingNoiseForYou
      ? 'Select any dangerous sector to make a noise there'
      : renderClue(clues, matchData)

  useEffect(() => {
    console.log('effect')
    if (event) {
      console.log('should update src')
      setSrc(randSrc(event))
    }
  }, [currentPlayer, event])

  // // TODO checkbox to enable this or something?
  // useEffect(() => {
  //   if (clues && !promptingNoiseForYou) {
  //     // for some reason `speechSynthesis.speak(new SpeechSynthesisUtterance('I08'))` or with any other number gets pronounced weirdly on my phone...
  //     let readText = text.replace('I0', 'I 0 ')
  //     if (gameover)
  //       readText += `. Game Over! ${gameoverText(gameover.winner, matchData)}`
  //     const utterance = new SpeechSynthesisUtterance(readText)
  //     // const voice = speechSynthesis.getVoices()
  //     speechSynthesis.cancel()
  //     speechSynthesis.speak(utterance)
  //   }
  // }, [clues, gameover, matchData, text, promptingNoiseForYou, round, currentPlayer]) // depend on round to use effect even when clue stays same between rounds (eg. 2 silent sectors in a row)

  return (
    <div>
      <h2 className="centered">{text}</h2>
      <AudioPlayer src={src} />
    </div>
  )
}

function renderClue(clues, matchData) {
  return clues
    .map(({ id, msg }) => msg.replace('NAME', matchData.find(e => e.id === id).name))
    .join(' ')
}
