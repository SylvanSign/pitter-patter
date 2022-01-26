import { Server } from 'boardgame.io/server'
import path from 'path'
import serve from 'koa-static'
import Game from './Game'

const server = Server({ games: [Game] })
const SERVER_PORT = process.env.SERVER_PORT || 8000

// Build path relative to the server.js file
server.app.use(serve(path.resolve(__dirname, '../build')))

// server.router.get('/foo', (ctx, next) => {
//     console.log(server.app._io)
// })

server.run(SERVER_PORT);

server.app._io.on('connection', socket => {
    console.log(`connection ${socket.id}`)
    socket.on('disconnect', () => {
        console.log(`disconnect ${socket.id}`)
    })
})
