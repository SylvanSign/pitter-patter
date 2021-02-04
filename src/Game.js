import { TurnOrder, INVALID_MOVE } from 'boardgame.io/core'
import gridGenerator from './maps/gridGenerator'
import MAPS from './maps'
import { HEX_TYPES, idToCartesian, reachableHexes } from './maps/util'

// TODO generally, remove all console.logs
const Game = {
  // TODO remove this comment
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
    const [map, mapConfig] = Object.entries(MAPS)[1];// TODO make this selectable (from setupData?)
    const gridData = gridGenerator(map)

    const humanHex = gridData.grid.get(idToCartesian(mapConfig[HEX_TYPES.human]))
    const humanReachable = reachableHexes(gridData.grid, humanHex, 1)

    const alienHex = gridData.grid.get(idToCartesian(mapConfig[HEX_TYPES.alien]))
    const alienReachable = reachableHexes(gridData.grid, alienHex, 2)

    const { playOrder, } = ctx
    const [humans, aliens] = pickRoles(ctx, playOrder)
    const players = setupPlayers(
      { humans, humanHex, humanReachable, },
      { aliens, alienHex, alienReachable, },
    )

    const dangerDeck = makeDangerDeck(ctx)
    const escapeDeck = makeEscapeDeck(ctx)

    return {
      map,
      players,
      playOrder: ctx.random.Shuffle(playOrder),
      escapeDeck,
      dangerDeck,
      dangerDiscard: [],
      gridData,
      mapConfig,
    }
  },

  endIf(G, ctx) {
    // const currentPlayer = G.players[ctx.currentPlayer]
    // if (currentPlayer.role === 'human') {
    //   const hexType = G.mapConfig[currentPlayer.hex.id]
    //   if (hexType > 0 || hexType < 5) {
    //     return { winner: ctx.currentPlayer }; // TODO flesh this out
    //   }
    // }

    // TODO handle player elimination
    if (ctx.turn / ctx.numPlayers > 40) {
      return { winner: ctx.currentPlayer } // TODO fix this
    }

  },

  turn: {
    order: TurnOrder.CUSTOM_FROM('playOrder'), // TODO handle player elimination
    // TODO use stages to enforce this and allow other players to take notes when not current player?
    // moveLimit: 2, // must move, then either silent, draw, or attack

    onBegin(G, ctx) {
      const currentPlayer = G.players[ctx.currentPlayer]
      currentPlayer.reachable = reachableHexes(G.gridData.grid, currentPlayer.hex, currentPlayer.speed)
    },
  },

  moves: {
    move(G, ctx, hex) {
      const currentPlayer = G.players[ctx.currentPlayer]
      if (hex === currentPlayer.hex) {
        return INVALID_MOVE
      }

      switch (G.mapConfig[hex.id]) {
        case HEX_TYPES.human:
          return INVALID_MOVE
        case HEX_TYPES.alien:
          return INVALID_MOVE
        default: // proceed
      }

      if (!currentPlayer.reachable.has(hex)) {
        return INVALID_MOVE
      }

      currentPlayer.hex = hex
      currentPlayer.reachable = new Set() // TODO clean this reachable thing up

      switch (hex.type) {
        case HEX_TYPES.silent:
          console.log('silent sector')
          break;
        case HEX_TYPES.danger:
          console.log('dangerous sector')
          const dangerCard = drawDangerCard(G, ctx)
          console.log(dangerCard)
          break;
        default: // escape pod
          const escapeCard = G.escapeDeck.pop()
          if (escapeCard === 'success') {
            console.log('successful escape!')
          } else { // 'fail'
            console.log('failed launch!')
          }
      }
      ctx.events.endTurn()
    },
    silent(G, ctx) {
      // ctx.events.endTurn()
    },
    draw(G, ctx) {
      // ctx.events.endTurn()
    },
    attack(G, ctx) {
      // ctx.events.endTurn()
    },
  },
}

function drawDangerCard(G, ctx) {
  if (!G.dangerDeck.length) {
    G.dangerDeck = ctx.random.Shuffle(G.dangerDiscard.splice(0))
  }
  const dangerCard = G.dangerDeck.pop()
  G.dangerDiscard.push(dangerCard)
  return dangerCard
}

function pickRoles(ctx, playOrder) {
  const shuffled = ctx.random.Shuffle(playOrder)
  return [shuffled, shuffled.splice(shuffled.length / 2)]
}

function setupPlayers(
  { humans, humanHex, humanReachable, },
  { aliens, alienHex, alienReachable, },
) {
  let players = {}

  humans.reduce((players, p) => {
    players[p] = {
      role: 'human',
      hex: humanHex,
      speed: 1,
      reachable: humanReachable,
    }
    return players
  }, players)

  aliens.reduce((players, p) => {
    players[p] = {
      role: 'alien',
      hex: alienHex,
      speed: 2,
      reachable: alienReachable,
    }
    return players
  }, players)

  return players
}

function makeDangerDeck(ctx) {
  const deck = [
    ...Array(27).fill('you'),
    ...Array(27).fill('any'),
    ...Array(34).fill('silent'), // see TODO below
    // TODO actually differentiate items
    // ...Array(17).fill('item'),
    // ...Array(17).fill('silent'),
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
