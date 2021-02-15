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
    const [map, mapConfig] = Object.entries(MAPS)[0];// TODO make this selectable (from setupData?)
    const gridData = gridGenerator(map)

    const humanHex = gridData.grid.get(idToCartesian(mapConfig[HEX_TYPES.human]))

    const alienHex = gridData.grid.get(idToCartesian(mapConfig[HEX_TYPES.alien]))

    const { playOrder, } = ctx
    const [humans, aliens] = pickRoles(ctx, playOrder)
    const players = setupPlayers({ humans, humanHex, }, { aliens, alienHex, })

    const dangerDeck = makeDangerDeck(ctx)
    const escapeDeck = makeEscapeDeck(ctx)

    return {
      map,
      alienHex,
      players,
      playOrder: ctx.random.Shuffle(playOrder),
      playOrderPos: 0,
      escapeDeck,
      dangerDeck,
      dangerDiscard: [],
      gridData,
      mapConfig,
    }
  },

  endIf(G, ctx) {
    // if (G.players[ctx.currentPlayer].role === 'human') {
    //   const hexType = G.mapConfig[G.players[ctx.currentPlayer].hex.id]
    //   if (typeof hexType === 'number') {
    //     return { winner: ctx.currentPlayer }; // TODO flesh this out
    //   }
    // }

    // // TODO handle player elimination
    // if (ctx.turn / ctx.numPlayers > 40) {
    //   return { winner: ctx.currentPlayer } // TODO fix this
    // }
  },

  turn: {
    // TODO use stages to enforce this and allow other players to take notes when not current player?
    moveLimit: 1, // must move, then either silent, draw, or attack

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
      self.reachable = reachableHexes(G.gridData.grid, self.hex, self.speed)
    },

    // Increment the position in the play order at the end of the turn.
    onEnd(G) {
      G.playOrderPos = (G.playOrderPos + 1) % G.playOrder.length
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

      if (!currentPlayerData.reachable.has(hex)) {
        return INVALID_MOVE
      }

      currentPlayerData.hex = hex
      currentPlayerData.reachable = new Set() // TODO clean this reachable thing up

      switch (hex.type) {
        case HEX_TYPES.silent:
          G.clue = `Player ${ctx.currentPlayer} is in a silent sector...`
          ctx.events.endTurn()
          break
        case HEX_TYPES.danger:
          const dangerCard = drawDangerCard(G, ctx)
          G.clue = `Player ${ctx.currentPlayer} is in a dangerous sector, and you hear ${dangerCard}`
          break
        default: // escape pod
          const escapeCard = G.escapeDeck.pop()
          if (escapeCard === 'success') {
            G.clue = `Player ${ctx.currentPlayer} has successfully launched out of escape pod ${hex.type}`
            console.log('successful escape!')
            hex.status = 'success'
            hex.accessible = false
            ctx.events.endTurn()
          } else { // 'fail'
            G.clue = `Player ${ctx.currentPlayer} has failed to launch escape pod ${hex.id}`
            console.log('failed launch!')
            hex.status = 'fail'
            hex.accessible = false
            ctx.events.endTurn()
          }
      }
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

      if (!currentPlayerData.reachable.has(hex)) {
        return INVALID_MOVE
      }

      currentPlayerData.hex = hex
      currentPlayerData.reachable = new Set() // TODO clean this reachable thing up
      // TODO attack logic
      const clues = [`There has been an attack on sector ${hex.id}`]
      for (const [playerID, data] of Object.entries(G.players)) {
        if (playerID !== ctx.currentPlayer) {
          if (data.hex === hex) {
            eliminate(data, G, playerID, currentPlayerData)
            clues.push(`Player ${playerID} has been killed!`)
          }
        }
      }
      G.clue = clues.join(' ')
    },
  },
}

function eliminate(data, G, playerIDToEliminate, currentPlayerData) {
  switch (data.role) {
    case 'alien':
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
      break
    case 'human':
      G.players[playerIDToEliminate] = freshAlien(G.alienHex)
      currentPlayerData.speed = 3
      break
    default:
      throw new Error('Role other than alien or human!')
  }
}

function killPlayer(data) {

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
  // return [shuffled, shuffled.splice(shuffled.length / 2)]
  return [shuffled, []] // TODO remove
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
    reachable: new Set(),
    hand: [],
  }
}

function freshAlien(hex) {
  return {
    ...freshPlayer(hex),
    role: 'alien',
    speed: 2,
    reachable: new Set(),
    hand: [],
  }
}

function freshPlayer(hex) {
  return {
    hex,
    reachable: new Set(),
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

function makeEscapeDeck(ctx) {
  const deck = [
    // 'fail',
    // ...Array(4).fill('success'),
    // TODO remove these
    'fail',
    'success',
  ]

  return ctx.random.Shuffle(deck)
}

export default Game
