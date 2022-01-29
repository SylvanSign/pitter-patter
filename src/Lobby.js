import { useEffect, useRef, useState } from "react"
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
    const nav = useNavigate()
    const [lobby, setLobby] = useState([])
    let { room } = useParams()
    room = room.toUpperCase()

    const location = useLocation();
    const alreadyVerified = location.state || undefined
    const [valid, setValid] = useState(alreadyVerified)

    useEffect(() => () => { socket.emit('left-room') }, [])

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
    }, [alreadyVerified, room, id, name])

    useEffect(() => {
        socket.on('update', ({ data }) => {
            console.log('update was called')
            setLobby(data)
        })

        return () => {
            socket.off('update')
        }
    }, [])

    switch (valid) {
        case undefined:
            return null
        case false:
            return <Navigate to={'/'} state={room} />
        case true:
            return (
                <>
                    <h1>{room}</h1>
                    <ul>
                        {lobby.map(p => <li key={p.id}>{p.name}</li>)}
                    </ul>
                </>
            )
        default:
            throw new Error(`Unexpected state for 'valid': ${valid}`)

    }
}
