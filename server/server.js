import fetch from 'node-fetch'
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
        Origins.LOCALHOST_IN_DEVELOPMENT,
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
            Origins.LOCALHOST_IN_DEVELOPMENT,
        ],
    },
})
io.listen(process.env.SOCKET_IO_SERVER_PORT || 8001)

const innKeeper = new InnKeeper()

io.on('connection', socket => {
    console.log(`Socket ${socket.id} connected`)
    socket.data = {}

    const handleDisconnect = () => {
        const { id } = socket.data
        console.log(`Socket ${id} disconnected`)
        const room = innKeeper.room(id)
        innKeeper.checkout(id)
        if (room) {
            io.in(room).emit('update', { data: innKeeper.stuffs(room) })
        }
    }

    socket.on('disconnect', handleDisconnect)
    socket.on('left-room', handleDisconnect)

    socket.on('room-check', ({ room, name, id }) => {
        console.log(`Room check for ${room} ${name} ${id}`)
        const valid = innKeeper.open(room)
        socket.emit('room-check', { valid })
    })

    socket.on('new', ({ name }) => {
        join(socket, name, getRoom())
    })

    socket.on('join', ({ name, room, id }) => {
        if (innKeeper.open(room))
            join(socket, name, room, id)
        else
            socket.emit('invalid-room')
    })

    socket.on('map-change', ({ map }) => {
        const { room } = socket.data
        innKeeper.updateMap(room, map)
        socket.to(room).emit('update-map', { map })
    })

    socket.on('start', async () => {
        const { room } = socket.data
        const map = innKeeper.map(room)
        const numPlayers = innKeeper.size(room)

        // TODO prevent same room from creating duplicate matches
        const { matchID } = await createMatch({
            numPlayers,
            // TODO setupData may eventually carry rules changes like items, abilities, houserules, etc.
            setupData: {
                map,
            },
            unlisted: true,
        })
        io.in(room).emit('start', {
            matchID,
        })
    })
})

async function createMatch(data) {
    const response = await fetch('http://localhost:8000/games/pp/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json()
}

async function join(socket, name, room, id) {
    if (!id) {
        id = randomUUID()
    }
    const data = { name, id, room }
    socket.data = data
    innKeeper.checkin(data, room)
    socket.join(room)
    socket.emit('joined', { room, id })
    io.in(room).emit('update-players', { players: innKeeper.stuffs(room) })
    socket.emit('update-map', { map: innKeeper.map(room) })
}
