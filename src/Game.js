import { INVALID_MOVE } from 'boardgame.io/core'
import gridGenerator from './maps/gridGenerator'
import MAPS, { defaultMap } from './maps'
import { HEX_TYPES, idToCartesian, reachableHexes } from './maps/util'
import { EMOJIS } from './emojis'

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
    const randomizedPlayOrder = ctx.random.Shuffle(playOrder)
    const [humans, aliens] = pickRoles(ctx, playOrder)
    const players = setupPlayers({ humans, humanHex, }, { aliens, alienHex, })

    const dangerDeck = makeDangerDeck(ctx)
    const escapeDeck = makeEscapeDeck(ctx, Object.keys(mapConfig.escape).length)

    return makeSerializable({
      round: 1,
      map,
      alienHex: alienHex,
      players: players,
      startingPlayOrder: randomizedPlayOrder,
      playOrder: randomizedPlayOrder,
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
      return { winner: G.winners } // TODO fix this by making winners less ambiguous??
    }

    const humansLeft =
      G.playOrder
        .map(id => G.players[id].role)
        .filter(r => r === 'human')
        .length
    // TODO end if all escape pods have launched or failed?
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
      let speed = self.speed
      if (self.role === 'human' && self.hand.adrenaline) {
        speed += 1
      }
      self.reachable = makeSerializable(reachableHexes(gridData.grid, gridData.Hex, G.escapes, self.hex, speed))
    },

    // Increment the position in the play order at the end of the turn.
    onEnd(G) {
      G.playOrderPos = (G.playOrderPos + 1) % G.playOrder.length
      if (G.playOrderPos === 0) {
        G.clues.unshift({
          key: G.round,
          msg: `-------- Round ${G.round} --------`
        })
        ++G.round
      }
    },
  },

  moves: {
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
              // silence or item
              G.clues.unshift({
                key: `${ctx.currentPlayer} ${G.round}`,
                id: Number.parseInt(ctx.currentPlayer, 10),
                msg: `${G.round}: NAME may have found something in a dangerous sector`,
              })
              G.event = 'quiet'
              ctx.events.endTurn()
          }
          break
        default: // escape pod
          const escapeCard = G.escapeDeck.pop()
          if (escapeCard === 'success') {
            currentPlayerData.publicRole = 'success'
            G.clues.unshift({
              key: `${ctx.currentPlayer} ${G.round}`,
              id: Number.parseInt(ctx.currentPlayer, 10),
              msg: `${G.round}: NAME left in escape pod ${hex.type}`,
            })
            G.event = 'escape'
            G.escapes[hex.type] = 'success'
            G.winners.push(Number.parseInt(ctx.currentPlayer, 10))
            remove(G, ctx.currentPlayer, false)
            ctx.events.endTurn()
          } else { // 'fail'
            currentPlayerData.publicRole = 'human'
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
    attack(G, ctx, hex) {
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
        if (playerID !== ctx.currentPlayer && !data.dead) {
          if (data.hex.id === hex.id) {
            hitAnything = true
            eliminate(data, G, playerID, currentPlayerData)
            const stinger =
              (data.role === 'human')
                ? `killed ${EMOJIS.human} NAME. A new ${EMOJIS.alien} NAME has spawned!`
                : `killed ${EMOJIS.alien} NAME`
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
      currentPlayerData.publicRole = 'alien' // only aliens can attack
      ctx.events.endTurn()
    }, attackItem(G, ctx, hex) {
      const currentPlayerData = G.players[ctx.currentPlayer]
      if (currentPlayerData.role !== 'human') {
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
        if (playerID !== ctx.currentPlayer && !data.dead) {
          if (data.hex.id === hex.id) {
            hitAnything = true
            eliminate(data, G, playerID, currentPlayerData)
            const stinger =
              (data.role === 'human')
                ? `killed fellow ${EMOJIS.human} NAME. Murderer!`
                : `killed ${EMOJIS.alien} NAME`
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
      --currentPlayerData.hand.attack
      if (!currentPlayerData.hand.attack) {
        delete currentPlayerData.hand.attack
      }
      currentPlayerData.publicRole = 'human' // only humans can itemAttack
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
      G.players[playerIDToEliminate].publicRole = 'alien'
      currentPlayerData.speed = 3
      break
    default:
      throw new Error('Role other than alien or human!')
  }
}

function remove(G, playerIDToEliminate, markDead = true) {
  // Find index of player to remove.
  const index = G.playOrder.indexOf(playerIDToEliminate)
  // The move should be invalid if we can’t find the player to remove.
  if (index < 0) {
    return INVALID_MOVE
  }
  // Remove the player from G.playOrder.
  G.playOrder.splice(index, 1)
  // Decrement position if the eliminated position is lte in the order.
  if (index <= G.playOrderPos) {
    --G.playOrderPos
  }
  G.players[playerIDToEliminate].gone = true
  if (markDead) {
    G.players[playerIDToEliminate].dead = true
    G.players[playerIDToEliminate].role = 'dead'
  } else {
    G.players[playerIDToEliminate].role = 'success'
  }
}

function drawDangerCard(G, ctx) {
  if (!G.dangerDeck.length) {
    G.dangerDeck = ctx.random.Shuffle(G.dangerDiscard.splice(0))
  }
  const dangerCard = G.dangerDeck.pop()
  switch (dangerCard) {
    case 'you':
    case 'any':
      G.dangerDiscard.push(dangerCard)
      break
    default:
      // should 'silence' still go into hand so that we can have an accurate handsize in the UI?
      const hand = G.players[ctx.currentPlayer].hand
      hand[dangerCard] = hand[dangerCard] || 0
      ++hand[dangerCard]
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
  }
}

function freshAlien(hex) {
  return {
    ...freshPlayer(hex),
    role: 'alien',
    speed: 2,
    reachable: [],
  }
}

function freshPlayer(hex) {
  return {
    hex,
    reachable: [],
    hand: {},
  }
}

function makeDangerDeck(ctx) {
  // TODO replace items with silence if playing without items (look into setupData and lobby item toggles)
  const deck = [
    // ...Array(27).fill('you'),
    // ...Array(27).fill('any'),
    // ...Array(6).fill('silence'),
    ...Array(3).fill('adrenaline'),
    // ...Array(3).fill('sedatives'),
    // ...Array(2).fill('attack'),
    // ...Array(2).fill('cat'),
    // ...Array(2).fill('spotlight'),
    // ...Array(1).fill('teleport'),
    // ...Array(1).fill('defence'),
    // ...Array(1).fill('clone'),
    // ...Array(1).fill('sensor'),
    // ...Array(1).fill('mutation'),
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
