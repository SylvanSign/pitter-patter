import { useCallback, useEffect, useRef } from 'react'

const SERVER_PORT = process.env.REACT_APP_SERVER_PORT || 8000

export default function AudioPlayer({ src, action }) {
  const audioRef = useRef()

  useEffect(() => {
    const ref = audioRef.current
    if (ref) {
      ref.load()
      return () => {
        ref.pause()
        ref.currentTime = 0
      }
    }
  }, [src, action])

  const onCanPlay = useCallback(() => {
    audioRef.current.play()
  }, [])

  return (
    <audio ref={audioRef} onCanPlay={onCanPlay}>
      <source src={`http://${window.location.hostname}:${SERVER_PORT}/audio/${src}.ogg`} type="audio/ogg" />
      <source src={`http://${window.location.hostname}:${SERVER_PORT}/audio/${src}.mp3`} type="audio/mpeg" />
    </audio>
  )
}

const EVENT_SOUNDS = {
  start: [
    'humans-come-out-to-play',
    'aliens-come-out-to-play',
  ],
  end: [
    'do-not-be-sad-it-is-over',
    'it-over-wish-had-good-time',
  ],
  // silent means silent sector
  silent: [
    'silence-in-all-sectors',
    'you-hear-nothing',
    'all-you-hear-is-your-heartbeat-is-it-normally-that-fast',
  ],
  // quiet means no noise but in dangerous sector
  quiet: [
    'must-have-just-been-the-wind',
    'quiet-game',
    'sneaky-hobbitses',
  ],
  noise: [
    'did-you-hear-that',
    'i-thought-we-were-trying-to-be-sneaky',
    'noise-in-sector',
    'quiet-as-a-mouse',
    'somebody-was-a-little-clumsy',
    'that-one-sounded-like-it-hurt',
    'what-was-that-noise',
    'who-could-that-be',
  ],
  miss: [
    'sector-under-attack',
    'well-somebody-seems-upset',
    'a-swing-and-a-miss',
    'you-know-you-were-supposed-to-hit-that-attack',
    'you-would-be-amazing',
    'uh-oh-looks-wike-angwee',
  ],
  hit: [
    'a-player-has-been-eaten-which-is-the-opposite-of-what-they-were-told-to-do',
    'a-player-has-been-killed',
    'anybody-ever-tell-you-you-look-dead-man',
    'not-that-bad-to-be-eaten-by-alien',
  ],
  attackItem: [
    'must-feel-good-to-fight-back-for-a-change',
    'swing-away-merrill',
  ],
  adrenaline: [
    'drugs-are-bad',
    'power-overwhelming',
    'these-go-to-11',
  ],
  sedatives: [
    'chill-pill',
    'i-am-a-leaf-on-the-wind',
    'you-must-have-found-my-stash',
  ],
  mutation: [
    'magneto',
    'tnmt',
    'curse-your-betrayal',
  ],
  teleport: [
    'portal-quote',
    'start-the-clock',
    'somebody-took-the-blue-pill',
  ],
  escape: [
    'escape-pod-launched',
    'i-wish-i-could-leave-this-place-too',
  ],
  escapeFail: [
    'escape-pod-malfunctioned',
    'how-did-it-feel-dud-escape-pod',
  ],
}

export function randSrc(event) {
  return randomElement(EVENT_SOUNDS[event])
}

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}
