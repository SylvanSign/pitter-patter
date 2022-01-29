import { useEffect, useRef, useState } from "react"
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useParams,
    useNavigate,
    useLocation,
} from "react-router-dom"
import { io } from 'socket.io-client'

const socket = io(`http://${window.location.hostname}:8001`)

function Room({ id, setId, name }) {
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

function ErrorMsg({ error }) {
    if (!error)
        return null

    return <p className="alert alert-danger" role="alert">Could not find room {error}</p>
}

export default function Home() {
    const [name, setName] = useSessionStorageState('name')
    const [id, setId] = useSessionStorageState('id')

    if (!name)
        return <BaseNameSelector setName={setName} />

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing name={name} setName={setName} setId={setId} />} />
                <Route path="/name" element={<NameSelector setName={setName} />} />
                <Route path="/join" element={<Join name={name} id={id} />} />
                <Route path="/rooms/:room" element={<Room name={name} id={id} setId={setId} />} />
                <Route path="*" element={<Navigate to={"/"} replace={true} />} />
            </Routes>
        </BrowserRouter>
    )
}

function Landing({ name, setName, setId }) {
    const location = useLocation();

    if (!name) {
        return <BaseNameSelector setName={setName} />
    }
    return (
        <>
            <ErrorMsg error={location.state} />
            <GameSelector name={name} setId={setId} />
        </>
    )
}

function Join({ id, name }) {
    const nav = useNavigate()
    const roomRef = useRef()
    const [error, setError] = useState()
    const [disabled, setDisabled] = useState(false)

    // remove socket listeners on unmount
    useEffect(() => () => { socket.off('room-check') }, [])

    const onSubmit = e => {
        e.preventDefault()
        setDisabled(true)
        const room = roomRef.current.value.toUpperCase()
        socket.emit('room-check', { room, id, name })
        socket.once('room-check', ({ valid }) => {
            if (valid) {
                nav(`/rooms/${room}`, { state: true }) // true meaning already verified the room
            } else {
                setError(room)
                setDisabled(false)
                roomRef.current.select()
            }
        })
    }

    return (
        <>
            <ErrorMsg error={error} />
            <h2>Join Room</h2>
            <form onSubmit={onSubmit}>
                <input autoCapitalize="none" autoComplete="off" autoCorrect="off" id="form_name"
                    maxLength={4} minLength={4} pattern="^[A-Za-z]{4}$" placeholder="ENTER 4-LETTER ROOM CODE"
                    style={{ textTransform: 'uppercase' }} title="Room code will be one 4-letter word"
                    type="text" autoFocus={true} required={true}
                    ref={roomRef} />
                <button type="submit" disabled={disabled}>SUBMIT</button>
            </form>
        </>
    )
}

function GameSelector({ name, setId }) {
    const nav = useNavigate()

    useEffect(() => () => { socket.off('joined') }, [])

    const onClickNameChange = e => {
        e.preventDefault()
        nav("/name")
    }

    const onClickJoinGame = e => {
        nav("/join")
    }

    const onClickNewGame = e => {
        socket.emit('new', { name })
        socket.once('joined', ({ room, id }) => {
            sessionStorage.setItem('room', room)
            setId(id)
            nav(`rooms/${room}`)
        })
    }

    return (
        <>
            <h2>Welcome, {name} <sup>(<a href='/' onClick={onClickNameChange}>change</a>)</sup></h2>
            <button onClick={onClickJoinGame}>JOIN GAME</button>
            {' '}
            <button className="button-outline" onClick={onClickNewGame}>NEW GAME</button>
        </>
    )
}

function NameSelector({ setName }) {
    const nav = useNavigate()
    return <BaseNameSelector setName={setName} afterSubmit={() => nav('/')} />
}

function BaseNameSelector({ setName, afterSubmit = () => { } }) {
    const nameRef = useRef()

    const onSubmit = e => {
        e.preventDefault()
        const name = nameRef.current.value.toUpperCase()
        setName(name)
        afterSubmit()
    }

    return (
        <>
            <h2>Enter a name</h2>
            <form onSubmit={onSubmit}>
                <input autoCapitalize="none" autoComplete="off" autoCorrect="off" id="form_name"
                    maxLength={20} pattern="^.*[^ ].*$" placeholder="ENTER YOUR NAME"
                    style={{ textTransform: 'uppercase' }} title="Name must be at least 1 character"
                    type="text" autoFocus={true} required={true}
                    ref={nameRef} />
                <button type="submit">SUBMIT</button>
            </form>
        </>
    )
}

function useSessionStorageState(key) {
    const [state, setState] = useState(sessionStorage.getItem(key))
    const setterWithStorage = arg => {
        let updatedState;
        if (typeof state === 'function') {
            updatedState = arg(state);
        } else {
            updatedState = arg;
        }
        sessionStorage.setItem(key, updatedState);
        setState(updatedState);
    }
    return [state, setterWithStorage]
}
