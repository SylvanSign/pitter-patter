import { TurnOrder } from 'boardgame.io/core'
import { EffectsPlugin } from 'bgio-effects/plugin';

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
  setup(ctx, setupData) {
    window.ctx = ctx // TODO remove this as it's for testing only
    const { playOrder, } = ctx
    const { map, } = setupData
    const [humans, aliens] = pickRoles(ctx, playOrder)
    const players = setupPlayers(humans, aliens, 0, 1) // TODO pull start hexes from map
    const dangerousDeck = makeDangerousDeck(ctx);
    const escapeDeck = makeEscapeDeck(ctx);

    return {
      map,
      players,
      playOrder: ctx.random.Shuffle(playOrder),
      escapeDeck,
      dangerousDeck,
    }
  },

  turn: {
    order: TurnOrder.CUSTOM_FROM('playOrder'),
  },

  plugins: [EffectsPlugin({
    effects: {
      move: {
        create(hex) { return hex },
        duration: 3,
      },
    },
  })],

  moves: {
    move(G, ctx, hex) {
      G.players[ctx.currentPlayer].hex = hex
      ctx.effects.move(hex)
    },

    silent(G, ctx) {
    },
  },
}

function pickRoles(ctx, playOrder) {
  const shuffled = ctx.random.Shuffle(playOrder)
  return [shuffled, shuffled.splice(shuffled.length / 2)]
}

function setupPlayers(humans, aliens, humanHex, alienHex) {
  let players = {}

  humans.reduce((players, p) => {
    players[p] = {
      role: 'human',
      hex: humanHex,
      speed: 1,
    }
    return players
  }, players)

  aliens.reduce((players, p) => {
    players[p] = {
      role: 'alien',
      hex: alienHex,
      speed: 2,
    }
    return players
  }, players)

  return players
}

function makeDangerousDeck(ctx) {
  const deck = [
    ...Array(27).fill('you'),
    ...Array(27).fill('any'),
    ...Array(17).fill('item'),
    ...Array(17).fill('silent'),
  ]

  return ctx.random.Shuffle(deck)
}

function makeEscapeDeck(ctx) {
  const deck = [
    'fail',
    ...Array(4).fill('success'),
  ]

  return ctx.random.Shuffle(deck)
}

export default Game
