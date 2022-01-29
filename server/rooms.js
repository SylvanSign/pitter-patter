import fs from 'fs'

const rooms = fs.readFileSync('./server/rooms.txt', 'utf8').split('\n')
if (rooms[rooms.length - 1] === '') {
  rooms.pop()
}
shuffle(rooms)
let nextRoomIndex = 0
let roomCodesLength = rooms.length

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function getRoom() {
  const code = rooms[nextRoomIndex]
  nextRoomIndex += 1
  nextRoomIndex %= roomCodesLength
  return code
}
