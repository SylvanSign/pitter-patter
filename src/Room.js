import { useEffect, useState } from "react"
import {
    Navigate,
    useNavigate,
    useParams,
} from "react-router-dom"
import { useSessionStorageState } from './hooks'
import { LobbyClient } from 'boardgame.io/client'
import MAPS from './maps'
import App from './App'
import socket from './io'


const lobbyClient = new LobbyClient({ server: `http://${window.location.hostname}:8000` })
window.l = lobbyClient // TODO remove

export default function Room({ id, setId, name }) {
    const [matchID, setMatchID] = useState()
    const [valid, room] = useRoomVerifier(name, id, setId, setMatchID)
    const [credentials, setCredentials] = useSessionStorageState('credentials')
    const [playerID, setPlayerID] = useSessionStorageState('playerID')

    switch (valid) {
        case undefined:
            return null
        case false:
            alert('yo!')
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
    const [map, setMap] = useState(Object.keys(MAPS)[0])
    const enoughPlayers = players.length > 1

    const startGame = () => {
        socket.emit('start')
    }

    useEffect(() => {
        socket.once('start', async ({ map, matchID }) => {
            const { playerID, playerCredentials } = await lobbyClient.joinMatch('pp', matchID, {
                playerName: `${name}-${new Date()}`,
            })
            console.log(`Joining matchID ${matchID}`)
            setCredentials(playerCredentials)
            setPlayerID(playerID)
            setMatchID(matchID)
            disableRoomLeaveNotifier()
        })

        return () => {
            socket.off('start')
        }
    }, [setCredentials, setPlayerID, setMatchID, name])

    return (
        <>
            <h1>{room}</h1>
            <MapSelector map={map} setMap={setMap} />
            {' '}
            <label htmlFor="startButton">REQUIRES AT LEAST 2 PLAYERS</label>
            <button id='startButton' disabled={!enoughPlayers} onClick={startGame}>START GAME</button>
            <ul>
                {players.map(p => <li key={p.id}>{p.name}</li>)}
            </ul>
        </>
    )
}

function MapSelector({ map, setMap }) {
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

function useRoomVerifier(name, id, setId, setMatchID) {
    const nav = useNavigate()
    const [valid, setValid] = useState()
    let { room } = useParams()
    room = room.toUpperCase()

    useEffect(() => {
        socket.emit('room-check', { room, id, name })
        socket.once('room-check', ({ valid }) => {
            socket.emit('join', { name, room, id })
            socket.once('joined', ({ id, matchID }) => {
                console.log(`YIKERSSSS ${matchID}`)
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
    }, [name, room, id, setId, setMatchID])

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
            console.log('update was called')
            setPlayers(players)
        })

        return () => {
            socket.off('update-players')
        }
    }, [setPlayers])

    return players
}
