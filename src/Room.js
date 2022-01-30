import { useEffect, useState } from "react"
import {
    Navigate,
    useParams,
    useNavigate,
    useLocation,
} from "react-router-dom"
import { useSessionStorageState } from './hooks'
import { LobbyClient } from 'boardgame.io/client'
import MAPS from './maps'
import App from './App'


const lobbyClient = new LobbyClient({ server: `http://${window.location.hostname}:8000` })
window.l = lobbyClient // TODO remove

export default function Room({ socket, id, setId, name }) {
    const [valid, room] = useRoomVerifier(socket, name, id, setId)
    const [credentials, setCredentials] = useSessionStorageState('credentials')
    const [playerID, setPlayerID] = useSessionStorageState('playerID')
    const [matchID, setMatchID] = useSessionStorageState('playerID')

    switch (valid) {
        case undefined:
            return null
        case false:
            return <Navigate to={'/'} state={room} />
        case true:
            if (credentials && playerID) {
                return <App playerID={playerID} credentials={credentials} matchID={matchID} />
            } else {
                return <Lobby socket={socket} room={room} name={name} setCredentials={setCredentials} setPlayerID={setPlayerID} setMatchID={setMatchID} />
            }
        default:
            throw new Error(`Unexpected state for 'valid': ${valid}`)

    }
}

function Lobby({ socket, room, name, setCredentials, setPlayerID, setMatchID }) {
    useRoomLeaverNotifier(socket)
    const players = usePlayersUpdater(socket)
    const [map, setMap] = useState(Object.keys[0])
    const enoughPlayers = players.length > 1

    const startGame = () => {
        socket.emit('start')
    }

    useEffect(() => {
        socket.once('start', async ({ map, matchID }) => {
            const { playerID, playerCredentials } = await lobbyClient.joinMatch('pp', matchID, {
                playerName: name,
            })
            console.log(`Joining matchID ${matchID}`)
            setCredentials(playerCredentials)
            setPlayerID(playerID)
            setMatchID(matchID)
        })

        return () => {
            socket.off('start')
        }
    }, [socket, setCredentials, setPlayerID, setMatchID, name])

    return (
        <>
            <h1>{room}</h1>
            <MapSelector socket={socket} map={map} setMap={setMap} />
            {' '}
            <label htmlFor="startButton">REQUIRES AT LEAST 2 PLAYERS</label>
            <button id='startButton' disabled={!enoughPlayers} onClick={startGame}>START GAME</button>
            <ul>
                {players.map(p => <li key={p.id}>{p.name}</li>)}
            </ul>
        </>
    )
}

function MapSelector({ socket, map, setMap }) {
    const options = Object.entries(MAPS).map(([name, _]) => <option key={name} value={name}>{name}</option>)

    useEffect(() => {
        socket.on('update-map', ({ map }) => {
            setMap(map)
        })

        return () => {
            socket.off('update-map')
        }
    }, [socket, setMap])

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

function useRoomVerifier(socket, name, id, setId) {
    const nav = useNavigate()
    const location = useLocation();
    const alreadyVerified = location.state || undefined
    const [valid, setValid] = useState(alreadyVerified)
    let { room } = useParams()
    room = room.toUpperCase()

    useEffect(() => {
        if (alreadyVerified) {
            socket.emit('join', { name, room, id })
            socket.once('joined', ({ room, id }) => {
                sessionStorage.setItem('room', room)
                setId(id)
            })
            socket.once('invalid-room', () => {
                nav("/", { state: room })
            })
            return () => {
                socket.off('joined')
                socket.off('invalid-room')
            }
        } else {
            socket.emit('room-check', { room, id, name })
            socket.once('room-check', ({ valid }) => {
                setValid(valid)
                socket.emit('join', { name, room, id })
                socket.once('joined', ({ room, id }) => {
                    sessionStorage.setItem('room', room)
                    setId(id)
                })
            })
            return () => {
                socket.off('room-check')
                socket.off('joined')
            }
        }
    }, [socket, name, alreadyVerified, room, id, setId, nav])

    return [valid, room]
}

function useRoomLeaverNotifier(socket) {
    useEffect(() => () => { socket.emit('left-room') }, [socket])
}

function usePlayersUpdater(socket) {
    const [players, setPlayers] = useState([])

    useEffect(() => {
        socket.on('update-players', ({ players }) => {
            console.log('update was called')
            setPlayers(players)
        })

        return () => {
            socket.off('update-players')
        }
    }, [socket, setPlayers])

    return players
}
