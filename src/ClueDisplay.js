import { useEffect, useState } from "react"
import AudioPlayer, { randSrc } from "./AudioPlayer"
import { EMOJIS } from "./emojis"

export default function ClueDisplay({ G: { clues, event, players }, ctx: { turn, gameover, currentPlayer, }, matchData }) {
  const [src, setSrc] = useState(randSrc('start'))

  useEffect(() => {
    if (event) {
      setSrc(randSrc(event))
    }
    if (gameover) {
      setSrc(randSrc('end'))
    }
  }, [currentPlayer, event, gameover])

  return (
    <div style={{ height: '20vh', overflow: 'auto' }}>
      <ul style={{ listStyle: 'none', display: 'table', margin: '0 auto' }}>
        {renderClues(clues, matchData, players).map(c => <li style={{ margin: '0' }} key={c.key}>{c.msg}</li>)}
      </ul>
      <AudioPlayer src={src} turn={turn} />
    </div >
  )
}

function renderClues(clues, matchData, players) {
  return clues.map(({ key, id, msg }) => {
    const renderedMsg = id !== undefined ? msg.replace(/NAME/g, matchData.find(e => e.id === id).name) : msg
    return {
      key,
      msg: renderedMsg,
    }
  })
}
