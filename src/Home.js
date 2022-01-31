import { useEffect, useRef, useState } from "react"
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate,
    useLocation,
} from "react-router-dom"
import Room from './Room'
import { useSessionStorageState } from './hooks'
import socket from './io'

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
    if (!name) {
        return <BaseNameSelector setName={setName} />
    }

    return <GameSelector name={name} setId={setId} />
}

function Join() {
    const nav = useNavigate()
    const roomRef = useRef()
    const [disabled, setDisabled] = useState(false)
    const location = useLocation();

    // remove socket listeners on unmount
    useEffect(() => () => { socket.off('room-check') }, [])

    const onSubmit = e => {
        e.preventDefault()
        setDisabled(true)
        const room = roomRef.current.value.toUpperCase()
        nav(`/rooms/${room}`) // true meaning already verified the room
    }

    return (
        <main className='container'>
            <ErrorMsg error={location.state} />
            <h2>Join Room</h2>
            <form onSubmit={onSubmit}>
                <input autoCapitalize="none" autoComplete="off" autoCorrect="off" id="form_name"
                    maxLength={4} minLength={4} pattern="^[A-Za-z]{4}$" placeholder="ENTER 4-LETTER ROOM CODE"
                    style={{ textTransform: 'uppercase' }} title="Room code will be one 4-letter word"
                    type="text" autoFocus={true} required={true}
                    ref={roomRef} />
                <button type="submit" disabled={disabled}>SUBMIT</button>
            </form>
        </main>
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
            setId(id)
            nav(`rooms/${room}`)
        })
    }

    return (
        <main className='container'>
            <h2>Welcome, {name} <sup>(<a href='/' onClick={onClickNameChange}>change</a>)</sup></h2>
            <button onClick={onClickJoinGame}>JOIN GAME</button>
            {' '}
            <button className="button-outline" onClick={onClickNewGame}>NEW GAME</button>
        </main>
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
        <main className="container">
            <h2>Enter a name</h2>
            <form onSubmit={onSubmit}>
                <input autoCapitalize="none" autoComplete="off" autoCorrect="off" id="form_name"
                    maxLength={20} pattern="^.*[^ ].*$" placeholder="ENTER YOUR NAME"
                    style={{ textTransform: 'uppercase' }} title="Name must be at least 1 character"
                    type="text" autoFocus={true} required={true}
                    ref={nameRef} />
                <button type="submit">SUBMIT</button>
            </form>
        </main>
    )
}
