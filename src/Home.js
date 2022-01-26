import { useEffect, useRef, useState } from "react"
import { io } from 'socket.io-client'

const socket = io(`http://${window.location.hostname}:8000/lobby`)

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

export default function Home() {
    const [name, setName] = useSessionStorageState('name')
    const [room, setRoom] = useSessionStorageState('room')
    const [id, setId] = useSessionStorageState('id')
    const nameRef = useRef()

    useEffect(() => {
        if (!id) {
            socket.emit('need-id')
            socket.once('id', ({ id }) => {
                console.log(`setting id to ${id}`)
                setId(id)
            })
        }
    }, [id])

    if (name) {
        if (room) {
            return (
                <h2>{room}</h2>
            )
        }
        const onClickNameChange = e => {
            e.preventDefault()
            setName(null)
        }

        const onClickJoinGame = e => {
            alert('TODO')
        }

        const onClickNewGame = e => {
            socket.emit('new')
            socket.once('joined', ({ room }) => {
                setRoom(room)
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
    } else {
        const onSubmit = e => {
            e.preventDefault()
            const value = nameRef.current.value.toUpperCase()
            setName(value)
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
}
