import { useEffect } from "react"
import { EMOJIS } from "./emojis"

export default function Players({ G: { players, startingPlayOrder, promptSensor }, ctx: { currentPlayer }, moves, playerID, matchData }) {
  const promptingSensorForYou = (promptSensor && currentPlayer === playerID)

  useEffect(() => {
    if (promptingSensorForYou)
      alert("Click any player's name to use SENSOR on them") // TODO better UI for this :)
  }, [promptingSensorForYou])

  const playerData = Object.entries(players).reduce((playerData, [id, player]) => {
    const parsedId = Number.parseInt(id, 10)
    playerData[id] = {
      id,
      name: matchData.find(e => e.id === parsedId).name,
      player,
    }
    return playerData
  }, {})

  const playerElements =
    startingPlayOrder
      .map(id => playerData[id])
      .map(({ id, name, player: { dead, gone, publicRole, handSize } }) => {
        let roleInfo
        if (dead) {
          roleInfo = EMOJIS.dead
        } else {
          roleInfo = `${EMOJIS[publicRole]}`
        }
        const currentPlayerMarker = id === currentPlayer ? '🤫' : ''
        name = id === playerID ? <span style={{ color: 'gold' }}>{name}</span> : name

        const hand = `${EMOJIS.hand}x${handSize}`

        let playerEntry
        if (promptingSensorForYou && id !== playerID && !gone) {
          playerEntry = <li key={id} style={{ margin: '0' }}>{'> '}{roleInfo} <button onClick={() => moves.sensorWho(id)}>{name}</button> {hand} {currentPlayerMarker}</li>
        } else {
          playerEntry = <li key={id} style={{ margin: '0' }}>{'> '}{roleInfo} {name} {hand} {currentPlayerMarker}</li>
        }
        return playerEntry
      })

  return (
    <div>
      <h3>Players </h3>
      <ul style={{ listStyle: 'none' }}>
        {playerElements}
      </ul>
    </div>
  )
}
