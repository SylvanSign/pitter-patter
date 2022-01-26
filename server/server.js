import { Server, Origins } from 'boardgame.io/server'
import path from 'path'
import serve from 'koa-static'
import Game from '../src/Game'

import { getCode } from './roomCodes'
import { randomUUID } from 'crypto';

const server = Server({
    games: [Game],
    origins: [
        'http://localhost:8000',
        'http://localhost:3000',
        Origins.LOCALHOST_IN_DEVELOPMENT,
    ],
})
const SERVER_PORT = process.env.SERVER_PORT || 8000
// Build path relative to the server.js file
server.app.use(serve(path.resolve(__dirname, '../build')))
server.run(SERVER_PORT);

// Lobby management before games start
const io = server.app._io

io.of('/lobby').on('connection', socket => {
    console.log(`connection ${socket.id}`)
    socket.on('disconnect', () => {
        console.log(`disconnect ${socket.id}`)
    })

    socket.on('need-id', () => {
        console.log(`got need-id request from ${socket.id}`)
        const id = randomUUID()
        socket.data = socket.data || {}
        socket.data.id = id
        socket.emit('id', { id })
    })

    socket.on('new', () => {
        const room = getCode()
        console.log(`Joining room code ${room}`)
        socket.join(room)
        socket.emit('joined', { room })
    })
})
