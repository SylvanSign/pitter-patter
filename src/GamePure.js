const Game = {
  // ctx = {
  //   "numPlayers": 2,
  //   "turn": 0,
  //   "currentPlayer": "0",
  //   "playOrder": [
  //     "0",
  //     "1"
  //   ],
  //   "playOrderPos": 0,
  //   "phase": null,
  //   "activePlayers": null,
  //   "random": {},
  //   "log": {},
  //   "events": {}
  // }
  setup(ctx) {
    window.ctx = ctx // TODO remove this as it's for testing only
    const { playOrder, } = ctx
    const [humans, aliens] = pickRoles(ctx, playOrder)
    const players = setupPlayers(humans, aliens, 0, 1) // TODO pull start coords from map
    return { players };
  },

  turn: {
    moveLimit: 1,
  },

  moves: {
    m(G, ctx) {
      alert('m')
    }
  },
}

function pickRoles(ctx, playOrder) {
  const shuffled = ctx.random.Shuffle(playOrder)
  return [shuffled, shuffled.splice(shuffled.length / 2)]
}

function setupPlayers(humans, aliens, humanStart, alienStart) {
  let players = {}

  humans.reduce((players, p) => {
    players[p] = {
      role: 'human',
      pos: humanStart,
      speed: 1,
    }
    return players
  }, players)

  aliens.reduce((players, p) => {
    players[p] = {
      role: 'alien',
      pos: alienStart,
      speed: 2,
    }
    return players
  }, players)

  return players
}

export default Game
