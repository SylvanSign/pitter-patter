import { useEffect } from "react"

export default function ClueDisplay({ G: { clue, }, ctx: { turn, }, playerID, }) {
  const text = clue

  useEffect(() => {
    if (clue && playerID === '0') { // TODO remove playerID check
      const utterance = new SpeechSynthesisUtterance(text)
      // const voice = speechSynthesis.getVoices()
      speechSynthesis.speak(utterance)
    }
  }, [clue, turn])

  return (
    <h1>{text}</h1>
  )
}
