import { EMOJIS } from "./emojis"

export default function Players({ G: { players, startingPlayOrder }, ctx: { currentPlayer }, playerID, matchData }) {
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
      .map(({ id, name, player: { dead, publicRole, handSize } }) => {
        let roleInfo
        if (dead) {
          roleInfo = EMOJIS.dead
        } else {
          roleInfo = `${EMOJIS[publicRole]}`
        }
        const currentPlayerMarker = id === currentPlayer ? '🤫' : ''
        name = id === playerID ? <span style={{ color: 'gold' }}>{name}</span> : name

        const hand = `${EMOJIS.hand}x${handSize}`

        return <li key={id} style={{ margin: '0' }}>{'> '}{roleInfo} {name} {hand} {currentPlayerMarker}</li>
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
