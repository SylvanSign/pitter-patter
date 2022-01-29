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


function ErrorMsg({ error }) {
    if (!error)
        return null

    return (
        <>
            <p className="alert alert-danger" role="alert">Could not find room {error}</p>
        </>
    )
}



export default function Home() {
    const [name, setName] = useSessionStorageState('name')
    const [socket, setSocket] = useState()

    useEffect(() => {
        const sock = io(`http://${window.location.hostname}:8001`)
        setSocket(sock)
        window.s = sock // TODO remove this
    }, [])

    if (!name)
        return <BaseNameSelector setName={setName} />

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing name={name} setName={setName} socket={socket} />} />
                <Route path="/name" element={<NameSelector setName={setName} />} />
                <Route path="/join" element={<Join socket={socket} />} />
                <Route path="/rooms/:room" element={<Room name={name} socket={socket} />} />
                <Route path="*" element={<Navigate to={"/"} replace={true} />} />
            </Routes>
        </BrowserRouter>
    )
}

function Landing({ name, setName, socket }) {
    const location = useLocation();

    if (!name) {
        return <BaseNameSelector setName={setName} />
    }
    return (
        <>
            <ErrorMsg error={location.state} />
            <GameSelector name={name} setName={setName} socket={socket} />
        </>
    )
}

function Join({ socket }) {
    const nav = useNavigate()
    const roomRef = useRef()
    const [error, setError] = useState()
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        return () => socket.off('room-check')
    }, [socket])

    const onSubmit = e => {
        e.preventDefault()
        setDisabled(true)
        const room = roomRef.current.value.toUpperCase()
        socket.emit('room-check', { room })
        socket.once('room-check', ({ valid }) => {
            if (valid) {
                nav(`/rooms/${room}`)
            } else {
                setError(room)
                setDisabled(false)
            }
        })
    }

    return (
        <>
            <ErrorMsg error={error} />
            <h2>Join Room</h2>
            <form onSubmit={onSubmit}>
                <input autoCapitalize="none" autoComplete="off" autoCorrect="off" id="form_name"
                    maxLength="4" minLength="4" name="form[name]" pattern="^[A-Za-z]{4}$" placeholder="ENTER 4-LETTER ROOM CODE"
                    style={{ textTransform: 'uppercase' }} title="Room code will be one 4-letter word"
                    type="text" autoFocus={true} required={true}
                    ref={roomRef} />
                <button type="submit" disabled={disabled}>SUBMIT</button>
            </form>
        </>
    )
}

function Room({ socket }) {
    const [lobby, setLobby] = useState([])
    const { room } = useParams()

    const [valid, setValid] = useState(undefined)
    useEffect(() => {
        socket.emit('room-check', { room })
        socket.once('room-check', ({ valid }) => setValid(valid))

        return () => socket.off('room-check')
    }, [room, socket])

    useEffect(() => {
        socket.on('update', ({ state }) => {
            console.log('update was called')
            setLobby(state)
        })

        return () => socket.off('update')
    }, [socket])

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

    }
}

function GameSelector({ name, socket }) {
    const nav = useNavigate()

    const onClickNameChange = e => {
        e.preventDefault()
        nav("/name")
    }

    const onClickJoinGame = e => {
        nav("/join")
    }

    const onClickNewGame = e => {
        socket.emit('new', { name })
        socket.once('joined', ({ room }) => {
            sessionStorage.setItem('room', room)
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

function BaseNameSelector({ setName, afterSubmit }) {
    const nameRef = useRef()

    const onSubmit = e => {
        e.preventDefault()
        const name = nameRef.current.value.toUpperCase()
        setName(name)
        if (afterSubmit) {
            afterSubmit()
        }
    }

    return (
        <>
            <h2>Enter a name</h2>
            <form onSubmit={onSubmit}>
                <input autoCapitalize="none" autoComplete="off" autoCorrect="off" id="form_name"
                    maxLength="20" name="form[name]" pattern="^.*[^ ].*$" placeholder="ENTER YOUR NAME"
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
