import { Server } from 'boardgame.io/server'
import Game from './Game'

const server = Server({ games: [Game] })
server.run(8000)
