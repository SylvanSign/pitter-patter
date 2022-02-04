import { useEffect, useRef } from 'react'


export default function AudioPlayer({ src }) {
  const audioRef = useRef()

  useEffect(() => {
    const ref = audioRef.current
    setTimeout(() => {
      if (ref) {
        ref.load()
        console.log('>>>> ')
        ref.play().catch(e => {
          console.error(`****************** ${e}`)
        })
      }
    }, 0)
    return () => {
      ref.pause()
      ref.currentTime = 0
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
    'humans-come-out-to-play',
    'aliens-come-out-to-play',
  ],
  end: [
    'do-not-be-sad-it-is-over',
    'it-over-wish-had-good-time',
  ],
  silent: [
    'all-you-hear-is-your-heartbeat-is-it-normally-that-fast',
    'silence-in-all-sectors',
    'must-have-just-been-the-wind',
    'you-hear-nothing',
    'quiet-game',
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
