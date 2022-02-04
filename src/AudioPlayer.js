import { useEffect, useRef } from 'react'
import shuffle from '../shared/shuffle'

export default function AudioPlayer({ src }) {
  const audioRef = useRef()

  useEffect(() => {
    audioRef.current.play()
    return () => {
      audioRef.current.pause()
    }
  }, [src])

  return (
    <audio ref={audioRef}>
      <source src={`http://${window.location.hostname}:8000/audio/${src}.ogg`} type="audio/ogg" />
      <source src={`http://${window.location.hostname}:8000/audio/${src}.mp3`} type="audio/mpeg" />
    </audio>
  )
}

const EVENT_SOUNDS = {
  start: [
    'public/audio/humans-come-out-to-play.mp3',
    'public/audio/aliens-come-out-to-play.mp3',
  ],
  end: [],
  silent: [
    'public/audio/all-you-hear-is-your-heartbeat-is-it-normally-that-fast.mp3',
  ],
  noise: [
    'public/audio/did-you-hear-that.mp3',
  ],
  attack: [],
  kill: [
    'public/audio/a-player-has-been-eaten-which-is-the-opposite-of-what-they-were-told-to-do.mp3',
    'public/audio/a-player-has-been-killed.mp3',
    'public/audio/anybody-ever-tell-you-you-look-dead-man.mp3',
  ],
  escape: [
    'public/audio/escape-pod-launched.mp3',
  ],
  escapeFail: [],
}

export function randSourceFor(event) {
  return shuffle(EVENT_SOUNDS[event])[0]
}
