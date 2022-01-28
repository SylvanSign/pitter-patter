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
    const [lobbyState, setLobbyState] = useState([])
    const [id, setId] = useSessionStorageState('id')

    useEffect(() => {
        if (id) {
            socket.emit('have-id', { id, name })
        } else {
            socket.emit('need-id')
            socket.once('id', ({ id }) => {
                console.log(`setting id to ${id}`)
                setId(id)
            })
        }

        socket.on('update', ({ state }) => {
            console.log('update was called')
            setLobbyState(state)
        })
    }, [id])

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing name={name} setName={setName} />} />
                <Route path="/name" element={<NameSelector setName={setName} />} />
                <Route path="/rooms/:room" element={<Room lobbyState={lobbyState} />} />
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

function Room({ lobbyState }) {
    const { room } = useParams()
    return <Lobby room={room} lobbyState={lobbyState} />
}

function GameSelector({ name }) {
    const nav = useNavigate()

    const onClickNameChange = e => {
        e.preventDefault()
        nav("/name")
    }

    const onClickJoinGame = e => {
        alert('TODO')
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

function Lobby({ room, lobbyState }) {
    return (
        <>
            <h1>{room}</h1>
            <ul>
                {lobbyState.map(p => <li key={p}>{p}</li>)}
            </ul>
        </>
    )
}

function NameSelector({ setName }) {
    const nav = useNavigate()
    const nameRef = useRef()

    const onSubmit = e => {
        e.preventDefault()
        const value = nameRef.current.value.toUpperCase()
        setName(value)
        nav("/")
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
