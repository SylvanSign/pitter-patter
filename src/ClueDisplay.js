import { useEffect, useState } from "react"
import AudioPlayer, { randSrc } from "./AudioPlayer"

export default function ClueDisplay({ G: { clues, event, action, players }, ctx: { turn, gameover, currentPlayer, }, matchData }) {
  const [src, setSrc] = useState(randSrc('start'))

  useEffect(() => {
    if (event) {
      setSrc(randSrc(event))
    }
    if (gameover) {
      setSrc(randSrc('end'))
    }
  }, [currentPlayer, event, action, gameover])

  return (
    <div style={{ height: '20vh', overflow: 'auto' }}>
      <ul style={{ listStyle: 'none', display: 'table', margin: '0 auto' }}>
        {renderClues(clues, matchData, players).map(c => <li style={{ margin: '0' }} key={c.key}>{c.msg}</li>)}
      </ul>
      <AudioPlayer src={src} action={action} />
    </div >
  )
}

function renderClues(clues, matchData, players) {
  return clues.map(({ id, msg }, index) => {
    const renderedMsg = id !== undefined ? msg.replace(/NAME/g, matchData.find(e => e.id === id).name) : msg
    return {
      key: index,
      msg: renderedMsg,
    }
  })
}
