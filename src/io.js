import { io } from 'socket.io-client'

const socket = io(`http://${window.location.hostname}:8001`)

export default socket
