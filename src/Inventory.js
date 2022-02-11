export default function Inventory({ G: { players }, moves, playerID }) {
  const { hand } = players[playerID]
  return (
    <div>
      <h3 style={{ display: 'inline' }}>Items</h3>
      <ul style={{ listStyle: 'none', display: 'inline' }}>
        {
          Object.entries(hand)
            .filter(([card, _]) => card !== 'silence')
            .map(([card, count]) => (
              <li key={card} style={{ display: 'inline' }}>
                {' '}{count}x
                <button className="button-outline" onClick={() => moves[card]()}>
                  {card}
                </button>
              </li>
            ))
        }
      </ul >
    </div>
  )
}
