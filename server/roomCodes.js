import fs from 'fs'

const roomCodes =
  fs.readFileSync('./server/rooms.txt', 'utf8')
    .split('\n')
if (roomCodes[roomCodes.length - 1] === '') {
  roomCodes.pop()
}
shuffle(roomCodes)
let nextRoomIndex = 0
let roomCodesLength = roomCodes.length

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function getCode() {
  const code = roomCodes[nextRoomIndex]
  nextRoomIndex += 1
  nextRoomIndex %= roomCodesLength
  return code
}
