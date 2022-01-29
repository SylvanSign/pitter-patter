import { useEffect, useState } from "react"
import {
    Navigate,
    useParams,
    useNavigate,
    useLocation,
} from "react-router-dom"
import { LobbyClient } from 'boardgame.io/client'

const lobbyClient = new LobbyClient({ server: `http://${window.location.hostname}:8000` })
window.l = lobbyClient // TODO remove

export default function Room({ socket, id, setId, name }) {
    const [valid, room] = useRoomVerifier(socket, name, id, setId)

    switch (valid) {
        case undefined:
            return null
        case false:
            return <Navigate to={'/'} state={room} />
        case true:
            return <Lobby socket={socket} room={room} />
        default:
            throw new Error(`Unexpected state for 'valid': ${valid}`)

    }
}

function Lobby({ socket, room }) {
    useRoomLeaverNotifier(socket)
    const lobby = useLobbyUpdater(socket)
    const enoughPlayers = lobby.length > 1

    return (
        <>
            <h1>{room}</h1>
            <button disabled={!enoughPlayers}>{enoughPlayers ? 'BEGIN THE GAME' : 'NEED ANOTHER PLAYER...'}</button>
            <ul>
                {lobby.map(p => <li key={p.id}>{p.name}</li>)}
            </ul>
        </>
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

function useLobbyUpdater(socket) {
    const [lobby, setLobby] = useState([])

    useEffect(() => {
        socket.on('update', ({ data }) => {
            console.log('update was called')
            setLobby(data)
        })

        return () => {
            socket.off('update')
        }
    }, [socket, setLobby])

    return lobby
}
