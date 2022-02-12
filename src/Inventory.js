// disabled because they are handled through a separate mechanism (ie. attack as modal choice, cat as confirm window)
const DISABLED_CARDS = [
  'attack',
  'cat',
  'defense',
  'clone',
]

export default function Inventory({ G: { players }, moves, playerID }) {
  const self = players[playerID]
  const { hand } = self
  return (
    <div>
      <h3 style={{ display: 'inline' }}>Items</h3>
      <ul style={{ listStyle: 'none', display: 'inline' }}>
        {
          Object.entries(hand)
            .filter(([card, _]) => card !== 'silence')
            .map(([card, count]) => {
              const disabled = self.role === 'alien' || DISABLED_CARDS.includes(card)
              return (
                <li key={card} style={{ display: 'inline' }}>
                  {' '}{count}x
                  <button disabled={disabled} className="button-outline" onClick={() => moves[card]()}>
                    {card}
                  </button>
                </li>
              )
            })
        }
      </ul >
    </div>
  )
}
