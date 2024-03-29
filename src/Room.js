import { useEffect, useState } from "react"
import {
    Navigate,
    useNavigate,
    useParams,
} from "react-router-dom"
import { useSessionStorageState } from './hooks'
import { LobbyClient } from 'boardgame.io/client'
import MAPS, { defaultMap } from './maps'
import App from './App'
import socket from './io'
import { useNameGuarantee } from "./Home"

const SERVER_PORT = process.env.REACT_APP_SERVER_PORT || 8000

const lobbyClient = new LobbyClient({ server: `http://${window.location.hostname}:${SERVER_PORT}` })
// window.l = lobbyClient // TODO remove

export default function Room({ id, setId, name, setName }) {
    const [matchID, setMatchID] = useState()
    const [valid, room] = useRoomVerifier(name, id, setId, setMatchID)
    const [credentials, setCredentials] = useSessionStorageState('credentials')
    const [playerID, setPlayerID] = useSessionStorageState('playerID')

    const nameComp = useNameGuarantee(name, setName)
    if (nameComp)
        return nameComp

    switch (valid) {
        case undefined:
            return null
        case false:
            return <Navigate to={'/join'} state={room} />
        case true:
            if (matchID && credentials && playerID) {
                return <App playerID={playerID} credentials={credentials} matchID={matchID} />
            } else {
                return <Lobby room={room} name={name} setCredentials={setCredentials} setPlayerID={setPlayerID} setMatchID={setMatchID} />
            }
        default:
            throw new Error(`Unexpected state for 'valid': ${valid}`)

    }
}

function Lobby({ room, name, setCredentials, setPlayerID, setMatchID }) {
    const disableRoomLeaveNotifier = useRoomLeaverNotifier()
    const players = usePlayersUpdater()
    const enoughPlayers = players.length > 1

    const startGame = () => {
        socket.emit('start')
    }

    useEffect(() => {
        socket.once('start', async ({ matchID }) => {
            const { playerID, playerCredentials } =
                await lobbyClient.joinMatch('pp', matchID, { playerName: name })
            setCredentials(playerCredentials)
            setPlayerID(playerID)
            setMatchID(matchID)
            disableRoomLeaveNotifier()
            sessionStorage.removeItem('notes')
            sessionStorage.removeItem('noises')
        })

        return () => {
            socket.off('start')
        }
    }, [setCredentials, setPlayerID, setMatchID, disableRoomLeaveNotifier, name])

    return (
        <>
            <h1>{room}</h1>
            <MapSelector />
            <OptionSelector name='audio' startChecked={false} />
            <OptionSelector name='items' startChecked={true} />
            <label htmlFor="startButton">REQUIRES AT LEAST 2 PLAYERS</label>
            {' '}
            <button id='startButton' disabled={!enoughPlayers} onClick={startGame}>START GAME</button>
            <ul>
                {players.map(p => <li key={p.id}>{p.name}</li>)}
            </ul>
        </>
    )
}

function MapSelector() {
    const [map, setMap] = useState(defaultMap)
    const options = Object.entries(MAPS).map(([name, _]) => <option key={name} value={name}>{name}</option>)

    useEffect(() => {
        socket.on('update-map', ({ map }) => {
            setMap(map)
        })

        return () => {
            socket.off('update-map')
        }
    }, [setMap])

    function onChange(e) {
        const map = e.target.value
        setMap(map)
        socket.emit('map-change', { map })
    }

    return (
        <div>
            <label htmlFor='mapSelector' style={{ display: 'inline-block' }}>Select Map</label>
            {' '}
            <select id='mapSelector' value={map} onChange={onChange}>
                {options}
            </select>
        </div>
    )
}



function OptionSelector({ name, startChecked }) {
    const [checked, setChecked] = useState(startChecked)

    useEffect(() => {
        socket.on('update-option', ({ name: optionName, value }) => {
            if (optionName === name)
                setChecked(!!value)
        })

        return () => {
            socket.off('update-option')
        }
    }, [name])

    function onChange(e) {
        const value = e.target.checked
        setChecked(value)
        socket.emit('option-change', { name, value })
    }

    return (
        <div>
            <label style={{ display: 'inline-block' }} htmlFor={name}>{'> '}{name}</label>
            {' '}
            <input type='checkbox' id={name} name={name} checked={checked} onChange={onChange} />
        </div >
    )
}

function useRoomVerifier(name, id, setId, setMatchID) {
    const nav = useNavigate()
    const [valid, setValid] = useState()
    let { room } = useParams()
    room = room.toUpperCase()

    useEffect(() => {
        if (name) {
            socket.emit('room-check', { room, id, name })
            socket.once('room-check', ({ valid }) => {
                socket.emit('join', { name, room, id })
                socket.once('joined', ({ id, matchID }) => {
                    setId(id)
                    setValid(valid)
                    setMatchID(matchID)
                })
                socket.once('invalid-room', () => {
                    nav("/join", { state: room })
                })
            })
            return () => {
                socket.off('room-check')
                socket.off('joined')
                socket.off('invalid-room')
            }
        }
    }, [name, room, id, setId, setMatchID, nav])

    return [valid, room]
}

function useRoomLeaverNotifier() {
    const [disabled, setDisabled] = useState(false)
    useEffect(() => () => {
        if (disabled)
            socket.emit('left-room')
    }, [disabled])

    return () => setDisabled(true)
}

function usePlayersUpdater() {
    const [players, setPlayers] = useState([])

    useEffect(() => {
        socket.on('update-players', ({ players }) => {
            setPlayers(players)
        })

        return () => {
            socket.off('update-players')
        }
    }, [setPlayers])

    return players
}
