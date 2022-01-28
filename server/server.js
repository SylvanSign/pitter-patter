import { Server, Origins } from 'boardgame.io/server'
import path from 'path'
import serve from 'koa-static'
import { Server as SocketIOServer } from 'socket.io'
import Game from '../src/Game'

import { getRoom } from './rooms'
import { randomUUID } from 'crypto';

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

io.on('connection', socket => {
    socket.data = {}
    socket.on('disconnect', () => {
        console.log(`disconnect ${socket.data ? socket.data.id : socket.id}`)
    })

    socket.on('need-id', () => {
        const id = randomUUID()
        socket.data.id = id
        console.log(`just gave id to ${socket.data.id}`)
        socket.emit('id', { id })
    })

    socket.on('have-id', ({ id }) => {
        socket.data.id = id
        console.log(`got have-id request from ${socket.data.id}`)
    })

    socket.on('new', ({ name }) => {
        socket.data.name = name
        const room = getRoom()
        console.log(`Joining *new* room ${room}`)
        socket.join(room)
        socket.emit('joined', { room })
    })

    socket.on('join', async ({ name, room }) => {
        socket.data.name = name
        console.log(`Joining room ${room}`)
        await socket.join(room)
        socket.emit('joined', { room })
        const inRoom = await io.in(room).fetchSockets()
        const names = inRoom.map(s => s.data.name)
        console.log(names)
        io.in(room).emit('update', { names })
    })
})
