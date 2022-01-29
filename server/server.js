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
    // origins: [
    //     'http://localhost:3000',
    //     'http://localhost:8001',
    //     Origins.LOCALHOST_IN_DEVELOPMENT,
    // ],
})
// Build path relative to the server.js file
server.app.use(serve(path.resolve(__dirname, '../build')))
server.run(process.env.SERVER_PORT || 8000);

// Lobby management before games start
const io = new SocketIOServer({
    cors: {
        origins: [
            Origins.LOCALHOST_IN_DEVELOPMENT,
        ],
    },
})
io.listen(process.env.SOCKET_IO_SERVER_PORT || 8001)

const innKeeper = new InnKeeper()

io.on('connection', socket => {
    socket.data = {}
    socket.on('disconnect', () => {
        const id = socket.data.id
        innKeeper.checkout(id)
    })

    socket.on('need-id', () => {
        const id = randomUUID()
        socket.data.id = id
        socket.emit('id', { id })
    })

    socket.on('have-id', ({ id, name }) => {
        socket.data = { id, name }
        const room = innKeeper.room(id)
        if (room)
            join(socket, room)
    })

    socket.on('new', ({ name }) => {
        socket.data.name = name
        const room = getRoom()
        join(socket, room)
    })

    socket.on('join', async ({ name, room }) => {
        socket.data.name = name
        join(socket, room)
    })
})

async function join(socket, room) {
    innKeeper.checkin(socket.data, room)
    socket.join(room)
    socket.emit('joined', { room })
    const inRoom = await io.in(room).fetchSockets()
    const names = innKeeper.map(s => s.data.name)
    io.in(room).emit('update', { state: names })
}
