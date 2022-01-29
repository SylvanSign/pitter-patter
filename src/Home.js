import { useEffect, useRef, useState } from "react"
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useParams,
    useNavigate,
} from "react-router-dom"
import { io } from 'socket.io-client'

const socket = io(`http://${window.location.hostname}:8001`)
window.s = socket // TODO remove this

export default function Home() {
    const [name, setName] = useSessionStorageState('name')

    if (!name) {
        console.log('yikers')
        return <BaseNameSelector setName={setName} />
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing name={name} setName={setName} />} />
                <Route path="/name" element={<NameSelector setName={setName} />} />
                <Route path="/join" element={<Join />} />
                <Route path="/rooms/:room" element={<Room name={name} />} />
                <Route path="*" element={<Navigate to={"/"} replace={true} />} />
            </Routes>
        </BrowserRouter>
    )
}

function Landing({ name, setName, setRoom }) {
    if (!name) {
        return <NameSelector setName={setName} />
    }
    return <GameSelector name={name} setName={setName} />
}

function Join() {
    const nav = useNavigate()
    const roomRef = useRef()
    const [error, setError] = useState()

    const onSubmit = e => {
        e.preventDefault()
        const room = roomRef.current.value.toUpperCase()
        nav(`/rooms/${room}`)
    }

    return (
        <>
            {error ? <p class="alert alert-danger" role="alert">Cannot find room {error}</p> : ''}
            <h2>Join Room</h2>
            <form onSubmit={onSubmit}>
                <input autoCapitalize="none" autoComplete="off" autoCorrect="off" id="form_name"
                    maxLength="4" minLength="4" name="form[name]" pattern="^[A-Za-z]{4}$" placeholder="ENTER 4-LETTER ROOM CODE"
                    style={{ textTransform: 'uppercase' }} title="Room code will be one 4-letter word"
                    type="text" autoFocus={true} required={true}
                    ref={roomRef} />
                <button type="submit">SUBMIT</button>
            </form>
        </>
    )
}

function Room({ name }) {
    const [id, setId] = useSessionStorageState('id')
    const [lobby, setLobby] = useState([])
    const { room } = useParams()

    useEffect(() => {
        socket.on('update', ({ state }) => {
            console.log('update was called')
            setLobby(state)
        })
    }, [id])

    return (
        <>
            <h1>{room}</h1>
            <ul>
                {lobby.map(p => <li key={p.id}>{p.name}</li>)}
            </ul>
        </>
    )
}

function GameSelector({ name }) {
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

function NameSelector({ setName }) {
    const nav = useNavigate()

    return (
        <BaseNameSelector setName={setName} afterSubmit={() => nav('/')} />
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
