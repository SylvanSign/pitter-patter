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
      .map(({ id, name, player }) => {
        if (id === currentPlayer) {
          return <li key={id} style={{ margin: '0' }}>{'> '}{name} 🤫</li>
        } else {
          return <li key={id} style={{ margin: '0' }}>{'> '}{name}</li>
        }
      })

  return (
    <div>
      <h3>Players </h3>
      <ul style={{ listStyle: 'none' }}>
        {playerElements}
      </ul >
    </div>
  )
}
