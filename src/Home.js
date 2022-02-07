import { useEffect, useRef, useState } from "react"
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate,
    useLocation,
    Link,
} from "react-router-dom"
import Room from './Room'
import { useSessionStorageState } from './hooks'
import socket from './io'

function ErrorMsg({ error }) {
    if (!error)
        return null

    return <div style={{ color: 'red' }}>!! Could not find room {error} !!</div>
}

function Header() {
    return (
        <header>
            <Link to="/">Home</Link>·
            <a href="https://github.com/SylvanSign/pitter-patter">Source</a>
            |inspired by <em>EftAiOS!</em>
            (<a href="http://www.eftaios.com/">Site</a>
            ·
            <a href="https://www.boardgamegeek.com/boardgame/82168/escape-aliens-outer-space">BGG</a>)
        </header>
    )
}

export default function Home() {
    const [name, setName] = useSessionStorageState('name')
    const [id, setId] = useSessionStorageState('id')

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Landing name={name} setName={setName} setId={setId} />} />
                <Route path="/name" element={<NameSelector setName={setName} backTo={'/'} />} />
                <Route path="/join" element={<Join name={name} setName={setName} id={id} />} />
                <Route path="/rooms/:room" element={<Room name={name} setName={setName} id={id} setId={setId} />} />
                <Route path="*" element={<Navigate to={"/"} replace={true} />} />
            </Routes>
        </BrowserRouter>
    )
}

export function useNameGuarantee(name, setName) {
    if (!name)
        return <NameSelector setName={setName} />
}

function Landing({ name, setName, setId }) {
    const nameComp = useNameGuarantee(name, setName)
    if (nameComp)
        return nameComp
    return <GameSelector name={name} setId={setId} />
}

function Join({ name, setName }) {
    const nav = useNavigate()
    const roomRef = useRef()
    const [disabled, setDisabled] = useState(false)
    const location = useLocation();

    // remove socket listeners on unmount
    useEffect(() => () => { socket.off('room-check') }, [])

    const nameComp = useNameGuarantee(name, setName)
    if (nameComp)
        return nameComp

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

function NameSelector({ setName, backTo = '/' }) {
    const nav = useNavigate()
    const nameRef = useRef()

    const onSubmit = e => {
        e.preventDefault()
        const name = nameRef.current.value.toUpperCase()
        setName(name)
        nav(backTo)
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
