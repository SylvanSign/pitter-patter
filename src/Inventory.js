export default function Inventory({ G: { players }, playerID }) {
  const { hand } = players[playerID]
  return (
    <>
      <h3 style={{ display: 'inline' }}>Items </h3>
      <ul style={{ listStyle: 'none', display: 'inline' }}>
        {
          hand
            .filter(card => card !== 'silence')
            .map(card => <li style={{ display: 'inline' }}><button className="button-outline">{card}</button></li>)
        }
      </ul >
    </>
  )
}
