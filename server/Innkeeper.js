export default class InnKeeper {
  constructor() {
    this._rooms = new Map()
    this._stuff = new Map()
    this._timeoutRefs = new Map()
  }

  checkin(stuff, room) {
    const { id } = stuff
    this._rooms.set(id, room)

    if (!this._stuff.has(room)) {
      this._stuff.set(room, {
        connected: new Set(),
        data: new Map(),
        map: undefined, // TODO do we need to initialize this?
      })
    }
    const roomStuff = this._stuff.get(room)
    roomStuff.connected.add(id)
    roomStuff.data.set(id, stuff)
  }

  checkout(id) {
    if (!id)
      return

    const room = this._rooms.get(id)
    this._rooms.delete(id) // TODO?

    const stuff = this._stuff.get(room)
    if (!stuff)
      return
    stuff.data.delete(id)
    const connected = stuff.connected
    connected.delete(id)

    if (!connected.size) {
      // TODO also cleanup other room resources like the associated Boardgame.io Game?
      clearTimeout(this._timeoutRefs.get(room))

      const ref = setTimeout(() => {
        console.log(`checking on ${room}`)
        if (!connected.size) {
          console.log(`deleting ${room}`)
          this._stuff.delete(room)
        }
        this._timeoutRefs.delete(room)
      }, 10_000)

      this._timeoutRefs.set(room, ref)
    }
  }

  room(id) {
    return this._rooms.get(id)
  }

  open(room) {
    return this._stuff.has(room)
  }

  stuff(room) {
    return this._stuff.get(room).data
  }

  stuffs(room) {
    return [...this.stuff(room).values()]
  }

  map(room) {
    return this._stuff.get(room).map
  }

  updateMap(room, map) {
    this._stuff.get(room).map = map
  }
}
