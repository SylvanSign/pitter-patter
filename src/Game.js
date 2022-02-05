import { INVALID_MOVE } from 'boardgame.io/core'
import gridGenerator from './maps/gridGenerator'
import MAPS, { defaultMap } from './maps'
import { HEX_TYPES, idToCartesian, reachableHexes } from './maps/util'

let gridData

function makeSerializable(data) {
  if (process.env.NODE_ENV === 'production') {
    return data;
  } else {
    return JSON.parse(JSON.stringify(data))
  }
}

// TODO generally, remove all console.logs
const Game = {
  name: 'pp',
  minPlayers: 2,
  maxPlayers: 8,
  setup(ctx, { map = defaultMap } = {}) {
    const mapConfig = MAPS[map]
    gridData = gridGenerator(map)
    const humanHex = gridData.grid.get(idToCartesian(mapConfig[HEX_TYPES.human]))
    const alienHex = gridData.grid.get(idToCartesian(mapConfig[HEX_TYPES.alien]))

    const { playOrder, } = ctx
    const [humans, aliens] = pickRoles(ctx, playOrder)
    const players = setupPlayers({ humans, humanHex, }, { aliens, alienHex, })

    const dangerDeck = makeDangerDeck(ctx)
    const escapeDeck = makeEscapeDeck(ctx, Object.keys(mapConfig.escape).length)

    return makeSerializable({
      round: 1,
      map,
      alienHex: alienHex,
      players: players,
      playOrder: ctx.random.Shuffle(playOrder),
      playOrderPos: 0,
      escapeDeck,
      dangerDeck,
      dangerDiscard: [],
      mapConfig,
      escapes: [],
      winners: [],
      clues: [],
      event: null,
    })
  },

  endIf(G, ctx) {
    if (G.round > 40) {
      return { winner: G.winners } // TODO fix this
    }

    const humansLeft =
      G.playOrder
        .map(id => G.players[id].role)
        .filter(r => r === 'human')
        .length
    if (humansLeft === 0) {
      return { winner: G.winners } // TODO fix this
    }
  },

  turn: {
    // TODO use stages to enforce this and allow other players to take notes when not current player?
    // moveLimit: 1, // must move, then either silent, draw, or attack

    order: {
      // Calculate the first player.
      first(G, ctx) {
        const playerID = G.playOrder[G.playOrderPos]
        return ctx.playOrder.indexOf(playerID)
      },

      // Calculate the next player.
      next(G, ctx) {
        // Look up the next player’s ID from the custom order.
        const playerID = G.playOrder[G.playOrderPos]
        // Find the position of the ID in boardgame.io’s play order.
        return ctx.playOrder.indexOf(playerID)
      },
    },
    onBegin(G, ctx) {
      const self = G.players[ctx.currentPlayer]
      self.reachable = makeSerializable(reachableHexes(gridData.grid, gridData.Hex, G.escapes, self.hex, self.speed))
    },

    // Increment the position in the play order at the end of the turn.
    onEnd(G) {
      G.playOrderPos = (G.playOrderPos + 1) % G.playOrder.length
      if (G.playOrderPos === 0) {
        ++G.round
      }
    },
  },

  moves: {
    move(G, ctx, hex) {
      const currentPlayerData = G.players[ctx.currentPlayer]
      if (hex === currentPlayerData.hex) {
        return INVALID_MOVE
      }

      switch (G.mapConfig[hex.id]) {
        case HEX_TYPES.human:
          return INVALID_MOVE
        case HEX_TYPES.alien:
          return INVALID_MOVE
        default: // proceed
      }

      if (!currentPlayerData.reachable.find(r => r.id === hex.id)) {
        return INVALID_MOVE
      }

      currentPlayerData.hex = makeSerializable(hex)
      currentPlayerData.reachable = [] // TODO clean this reachable thing up

      switch (hex.type) {
        case HEX_TYPES.silent:
          G.clues.unshift({
            key: `${ctx.currentPlayer} ${G.round}`,
            id: Number.parseInt(ctx.currentPlayer, 10),
            msg: `${G.round}: NAME is in a silent sector`,
          })
          G.event = 'silent'
          ctx.events.endTurn()
          break
        case HEX_TYPES.danger:
          const dangerCard = drawDangerCard(G, ctx)
          switch (dangerCard) {
            case 'silence':
              G.clues.unshift({
                key: `${ctx.currentPlayer} ${G.round}`,
                id: Number.parseInt(ctx.currentPlayer, 10),
                msg: `${G.round}: NAME is in a dangerous sector`,
              })
              G.event = 'quiet'
              ctx.events.endTurn()
              break
            case 'you':
              G.clues.unshift({
                key: `${ctx.currentPlayer} ${G.round}`,
                id: Number.parseInt(ctx.currentPlayer, 10),
                msg: `${G.round}: NAME made a noise in ${hex.id}`,
              })
              G.event = 'noise'
              G.noise = hex.id
              ctx.events.endTurn()
              break
            case 'any':
              G.promptNoise = true
              break
            default:
              throw new Error('Unexpected dangerCard value')
          }
          break
        default: // escape pod
          const escapeCard = G.escapeDeck.pop()
          if (escapeCard === 'success') {
            G.clues.unshift({
              key: `${ctx.currentPlayer} ${G.round}`,
              id: Number.parseInt(ctx.currentPlayer, 10),
              msg: `${G.round}: NAME left in escape pod ${hex.type}`,
            })
            G.event = 'escape'
            G.escapes[hex.type] = 'success'
            G.winners.push(Number.parseInt(ctx.currentPlayer, 10))
            remove(G, ctx.currentPlayer)
            ctx.events.endTurn()
          } else { // 'fail'
            G.clues.unshift({
              key: `${ctx.currentPlayer} ${G.round}`,
              id: Number.parseInt(ctx.currentPlayer, 10),
              msg: `${G.round}: NAME failed to launch escape pod ${hex.id}`,
            })
            G.event = 'escapeFail'
            G.escapes[hex.type] = 'fail'
            ctx.events.endTurn()
          }
      }
    },
    noise(G, ctx, hex) {
      // handle invalid moves
      if (!hex) {
        return INVALID_MOVE
      }
      const config = G.mapConfig[hex.id]
      switch (config) {
        case HEX_TYPES.human:
        case HEX_TYPES.alien:
        case HEX_TYPES.silent:
          return INVALID_MOVE
        default:
          if (config > 0 || config < 5) {
            return INVALID_MOVE
          }
      }
      G.clues.unshift({
        key: `${ctx.currentPlayer} ${G.round}`,
        id: Number.parseInt(ctx.currentPlayer, 10),
        msg: `${G.round}: NAME made a noise in ${hex.id}`,
      })
      G.event = 'noise'
      G.noise = hex.id
      G.promptNoise = false
      ctx.events.endTurn()
    },
    attack(G, ctx, hex) {
      // TODO factor out shared movement code with move and attack
      const currentPlayerData = G.players[ctx.currentPlayer]
      if (currentPlayerData.role !== 'alien') {
        return INVALID_MOVE
      }

      if (hex === currentPlayerData.hex) {
        return INVALID_MOVE
      }

      switch (G.mapConfig[hex.id]) {
        case HEX_TYPES.human:
          return INVALID_MOVE
        case HEX_TYPES.alien:
          return INVALID_MOVE
        default: // proceed
      }

      if (!currentPlayerData.reachable.find(r => r.id === hex.id)) {
        return INVALID_MOVE
      }

      currentPlayerData.hex = makeSerializable(hex)
      currentPlayerData.reachable = [] // TODO clean this reachable thing up
      // TODO attack logic
      const clues = [{
        key: `${ctx.currentPlayer} ${G.round}`,
        id: Number.parseInt(ctx.currentPlayer, 10),
        msg: `${G.round}: NAME attacked sector ${hex.id}`,
      }]
      G.noise = hex.id
      let hitAnything = false
      for (const [playerID, data] of Object.entries(G.players)) {
        if (playerID !== ctx.currentPlayer) {
          if (data.hex.id === hex.id) {
            hitAnything = true
            eliminate(data, G, playerID, currentPlayerData)
            const stinger =
              (data.role === 'human')
                ? "infected NAME"
                : "killed NAME"
            clues.push({
              key: `${ctx.currentPlayer} ${G.round} ${playerID}`,
              id: Number.parseInt(playerID, 10),
              msg: `and ${stinger}`
            })
          }
        }
      }
      G.clues = clues.concat(G.clues)
      G.event = hitAnything ? 'hit' : 'miss'
      ctx.events.endTurn()
    },
  },
}

function eliminate(data, G, playerIDToEliminate, currentPlayerData) {
  switch (data.role) {
    case 'alien':
      remove(G, playerIDToEliminate)
      break
    case 'human':
      G.players[playerIDToEliminate] = freshAlien(G.alienHex)
      currentPlayerData.speed = 3
      break
    default:
      throw new Error('Role other than alien or human!')
  }
}

function remove(G, playerIDToEliminate) {
  // Find index of player to remove.
  const index = G.playOrder.indexOf(playerIDToEliminate)
  // The move should be invalid if we can’t find the player to remove.
  if (index < 0) {
    return INVALID_MOVE
  }
  // Remove the player from G.playOrder.
  G.playOrder.splice(index, 1)
  // Decrement position if the eliminated position is lower in the order.
  if (index < G.playOrderPos) {
    --G.playOrderPos
  }
  G.players[playerIDToEliminate].dead = true
}

function drawDangerCard(G, ctx) {
  if (!G.dangerDeck.length) {
    G.dangerDeck = ctx.random.Shuffle(G.dangerDiscard.splice(0))
  }
  const dangerCard = G.dangerDeck.pop()
  if (dangerCard === 'silence' || dangerCard === 'item') {
    G.players[ctx.currentPlayer].hand.push(dangerCard)
  } else {
    G.dangerDiscard.push(dangerCard)
  }
  return dangerCard
}

function pickRoles(ctx, playOrder) {
  const shuffled = ctx.random.Shuffle(playOrder)
  return [shuffled, shuffled.splice(shuffled.length / 2)]
}

function setupPlayers({ humans, humanHex, }, { aliens, alienHex, }) {
  let players = {}

  humans.reduce((players, p) => {
    players[p] = freshHuman(humanHex)
    return players
  }, players)

  aliens.reduce((players, p) => {
    players[p] = freshAlien(alienHex)
    return players
  }, players)

  return players
}

function freshHuman(hex) {
  return {
    ...freshPlayer(hex),
    role: 'human',
    speed: 1,
    reachable: [],
    hand: [],
  }
}

function freshAlien(hex) {
  return {
    ...freshPlayer(hex),
    role: 'alien',
    speed: 2,
    reachable: [],
    hand: [],
  }
}

function freshPlayer(hex) {
  return {
    hex,
    reachable: [],
    hand: [],
  }
}

function makeDangerDeck(ctx) {
  const deck = [
    ...Array(27).fill('you'),
    ...Array(27).fill('any'),
    ...Array(34).fill('silence'), // see TODO below
    // TODO actually differentiate items
    // ...Array(17).fill('item'),
    // ...Array(17).fill 'silence'),
  ]

  return ctx.random.Shuffle(deck)
}

function makeEscapeDeck(ctx, numberPods) {
  const deck = [
    'fail',
    ...Array(numberPods).fill('success'),
  ]

  return ctx.random.Shuffle(deck)
}

export default Game
