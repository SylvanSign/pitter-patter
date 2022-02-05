import { useEffect, useState } from "react"
import AudioPlayer, { randSrc } from "./AudioPlayer"

export default function ClueDisplay({ G: { clues, event }, ctx: { turn, gameover, currentPlayer, }, playerID, matchData }) {
  const [src, setSrc] = useState(randSrc('start'))

  useEffect(() => {
    if (event) {
      setSrc(randSrc(event))
    }
    if (gameover) {
      setSrc(randSrc('end'))
    }
  }, [currentPlayer, event, gameover])

  console.log(clues.length)
  console.log(JSON.stringify(clues))

  return (
    <div style={{ height: '20vh', overflow: 'auto' }}>
      <ul style={{ listStyle: 'none', display: 'table', margin: '0 auto' }}>
        {renderClues(clues, matchData).map(c => <li style={{ margin: '0' }} key={c.key}>{c.msg}</li>)}
      </ul>
      <AudioPlayer src={src} turn={turn} />
    </div >
  )
}

function renderClues(clues, matchData) {
  return clues.map(({ key, id, msg }) => {
    const renderedMsg = id ? msg.replace('NAME', matchData.find(e => e.id === id).name) : msg
    return {
      key,
      msg: renderedMsg,
    }
  })
}
