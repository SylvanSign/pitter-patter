import fetch from 'node-fetch'
import { Server, Origins } from 'boardgame.io/server'
import path from 'path'
import serve from 'koa-static'
import { Server as SocketIOServer } from 'socket.io'
import Game from '../src/Game'

import { getRoom } from './rooms'
import { randomUUID } from 'crypto'
import InnKeeper from './Innkeeper'
import housekeeping from './housekeeping'

const server = Server({
    games: [Game],
    origins: [/.*/],
})
// Build path relative to the server.js file
const audioPath = path.resolve(__dirname, '../build/audio');
const appPath = path.resolve(__dirname, '../build');
server.app.use(serve(appPath))
const SERVER_PORT = process.env.SERVER_PORT || 8000
server.run(SERVER_PORT, () => {
    server.router.get('/audio/:audio').use(async (ctx, next) => await serve(audioPath))
    server.app.use(
        async (ctx, next) => await serve(appPath)(
            Object.assign(ctx, { path: 'index.html' }),
            next
        )
    )
})
housekeeping(server.db) // wipe stale games each day

// Lobby management before games start
const io = new SocketIOServer({
    cors: {
        origins: [/.*/],
    },
})
io.listen(process.env.SOCKET_IO_SERVER_PORT || 8001)

const innKeeper = new InnKeeper(server.db)

io.on('connection', socket => {
    socket.data = {}

    const handleDisconnect = () => {
        const { id, name, room } = socket.data
        innKeeper.checkout(id, room)
        if (room) {
            io.in(room).emit('update', { data: innKeeper.stuffs(room) })
        }
    }

    socket.on('disconnect', handleDisconnect)
    socket.on('left-room', handleDisconnect)

    socket.on('room-check', ({ room, name, id }) => {
        const valid = innKeeper.open(room, id)
        socket.emit('room-check', { valid })
    })

    socket.on('new', ({ name }) => {
        join(socket, name, getRoom())
    })

    socket.on('join', ({ name, room, id }) => {
        if (innKeeper.open(room, id))
            join(socket, name, room, id)
        else
            socket.emit('invalid-room')
    })

    socket.on('map-change', ({ map }) => {
        const { room } = socket.data
        innKeeper.updateMap(room, map)
        socket.to(room).emit('update-map', { map })
    })

    socket.on('option-change', ({ name, value }) => {
        const { room } = socket.data
        innKeeper.updateOption(room, name, value)
        socket.to(room).emit('update-option', { name, value })
    })

    socket.on('start', async () => {
        const { room } = socket.data
        const map = innKeeper.map(room)
        const audio = innKeeper.option(room, 'audio')
        const items = innKeeper.option(room, 'items')
        const numPlayers = innKeeper.size(room)

        // TODO prevent same room from creating duplicate matches
        const { matchID } = await createMatch({
            numPlayers,
            setupData: {
                map,
                audio,
                items,
            },
            unlisted: true,
        })
        innKeeper.setMatchID(room, matchID)
        io.in(room).emit('start', {
            matchID,
        })
    })
})

async function createMatch(data) {
    const response = await fetch(`http://localhost:${SERVER_PORT}/games/pp/create`, {
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
    socket.data = { name, id, room }
    innKeeper.checkin({ name, id }, room)
    socket.join(room)
    socket.emit('joined', { room, id, matchID: innKeeper.matchID(room) })
    io.in(room).emit('update-players', { players: innKeeper.stuffs(room) })
    socket.emit('update-map', { map: innKeeper.map(room) })
    socket.emit('update-option', { name: 'audio', value: innKeeper.option(room, 'audio') })
    socket.emit('update-option', { name: 'items', value: innKeeper.option(room, 'items') })
}
