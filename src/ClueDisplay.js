import { useEffect } from "react"

export default function ClueDisplay({ G: { clue, promptNoise, }, ctx: { turn, }, playerID, }) {
  const text = promptNoise ? 'Select any sector to make a noise there' : clue

  useEffect(() => {
    if (clue && playerID === '0') { // TODO remove playerID check
      const utterance = new SpeechSynthesisUtterance(text)
      // const voice = speechSynthesis.getVoices()
      speechSynthesis.speak(utterance)
    }
  }, [clue, turn]) // depend on turn to use effect even when clue stays same between turns (eg. 2 silent sectors in a row)

  return (
    <h1>{text}</h1>
  )
}
