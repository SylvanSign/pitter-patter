import { useRef, useState } from "react"

export default function Home() {
    const [name, setName] = useState(sessionStorage.getItem('name'))
    const nameRef = useRef()

    if (name) {
        const onClickNameChange = (e) => {
            e.preventDefault()
            setName(null)
        }
        return (
            <>
                <h2>Welcome, {name} <sup>(<a href='' onClick={onClickNameChange}>change</a>)</sup></h2>
                <button>JOIN GAME</button> <button className="button-outline">NEW GAME</button>
            </>
        )
    } else {
        const onSubmit = (e) => {
            e.preventDefault()
            const value = nameRef.current.value.toUpperCase()
            setName(value)
            sessionStorage.setItem('name', value)
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
