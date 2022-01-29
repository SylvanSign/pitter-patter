import { Server, Origins } from 'boardgame.io/server'
import path from 'path'
import serve from 'koa-static'
import { Server as SocketIOServer } from 'socket.io'
import Game from '../src/Game'

import { getRoom } from './rooms'
import { randomUUID } from 'crypto'
import InnKeeper from './Innkeeper'

const server = Server({
    games: [Game],
    origins: [
        '*',
    ],
})
// Build path relative to the server.js file
server.app.use(serve(path.resolve(__dirname, '../build')))
server.run(process.env.SERVER_PORT || 8000);

// Lobby management before games start
const io = new SocketIOServer({
    cors: {
        origins: [
            '*',
        ],
    },
})
io.listen(process.env.SOCKET_IO_SERVER_PORT || 8001)

const innKeeper = new InnKeeper()

io.on('connection', socket => {
    socket.data = {}

    const handleDisconnect = () => {
        const id = socket.data.id
        const room = innKeeper.room(id)
        innKeeper.checkout(id)
        if (room) {
            io.in(room).emit('update', { data: innKeeper.stuffs(room) })
        }
    }

    socket.on('disconnect', handleDisconnect)
    socket.on('left-room', handleDisconnect)

    socket.on('room-check', ({ room, name, id }) => {
        const valid = innKeeper.open(room)
        if (valid) {
            join(socket, name, room, id)
        }
        socket.emit('room-check', { valid })
    })

    socket.on('new', ({ name }) => {
        join(socket, name, getRoom())
    })

    socket.on('join', async ({ name, room }) => {
        join(socket, name, room)
    })
})

async function join(socket, name, room, id) {
    if (!id) {
        id = randomUUID()
    }
    const data = { name, id }
    socket.data = data
    innKeeper.checkin(data, room)
    socket.join(room)
    socket.emit('joined', { room, id })
    io.in(room).emit('update', { data: innKeeper.stuffs(room) })
}