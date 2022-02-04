import fs from 'fs'
import { shuffle } from '../shared/random'

const rooms = fs.readFileSync('./server/rooms.txt', 'utf8').split('\n')
if (rooms[rooms.length - 1] === '') {
  rooms.pop()
}
shuffle(rooms)
let nextRoomIndex = 0
let roomCodesLength = rooms.length

export function getRoom() {
  const code = rooms[nextRoomIndex]
  nextRoomIndex += 1
  nextRoomIndex %= roomCodesLength
  return code
}
