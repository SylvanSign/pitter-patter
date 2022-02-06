export default function Players({ G: { players, startingPlayOrder }, playerID, matchData }) {
  console.log(startingPlayOrder)
  const playerData = Object.entries(players).map(([id, player]) => {
    const parsedId = Number.parseInt(id, 10)
    return {
      id,
      name: matchData.find(e => e.id === parsedId).name,
      player,
    }
  })

  return null
  // return (
  //   <div>
  //     <h3>Players </h3>
  //     <ul>
  //       {
  //         renderClues(alivePlayerMsgs, matchData)
  //           .map(({ key, msg }) => )
  //       }
  //       {/* <li key={key} style={{ margin: '0' }}>{msg}</li> */}
  //     </ul >
  //   </div>
  // )
}
