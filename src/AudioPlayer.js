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
    'public/audio/silence-in-all-sectors.mp3',
    'public/audio/must-have-just-been-the-wind.mp3',
    'public/audio/you-hear-nothing.mp3',
  ],
  noise: [
    'public/audio/did-you-hear-that.mp3',
    'public/audio/i-thought-we-were-trying-to-be-sneaky.mp3',
    'public/audio/noise-in-sector.mp3',
    'public/audio/quiet-as-a-mouse.mp3',
    'public/audio/somebody-was-a-little-clumsy.mp3',
    'public/audio/that-one-sounded-like-it-hurt.mp3',
    'public/audio/what-was-that-noise.mp3',
    'public/audio/who-could-that-be.mp3',
  ],
  attack: [
    'public/audio/sector-under-attack.mp3',
  ],
  kill: [
    'public/audio/a-player-has-been-eaten-which-is-the-opposite-of-what-they-were-told-to-do.mp3',
    'public/audio/a-player-has-been-killed.mp3',
    'public/audio/anybody-ever-tell-you-you-look-dead-man.mp3',
    'public/audio/not-that-bad-to-be-eaten-by-alien.mp3',
  ],
  escape: [
    'public/audio/escape-pod-launched.mp3',
    'public/audio/i-wish-i-could-leave-this-place-too.mp3',
  ],
  escapeFail: [
    'public/audio/escape-pod-malfunctioned.mp3',
    'public/audio/how-did-it-feel-dud-escape-pod.mp3',
    'public/audio/i-wish-i-could-leave-this-place-too.mp3',
  ],
}

export function randSourceFor(event) {
  return shuffle(EVENT_SOUNDS[event])[0]
}
