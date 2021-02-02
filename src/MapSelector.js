import MAPS from './maps'

export default function MapSelector({ map, setMap }) {
  const options = Object.entries(MAPS).map(([name, _]) => <option key={name} value={name}>{name}</option>)

  function onChange(e) {
    setMap(e.target.value)
  }

  return (
    <select value={map} onChange={onChange}>
      {options}
    </select>
  )
}
