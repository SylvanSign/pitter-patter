export default class InnKeeper {
  constructor() {
    this._rooms = new Map()
    this._stuff = new Map()
  }

  checkin(stuff, room) {
    const { id } = stuff
    this._rooms.set(id, room)
    this._stuff.set(room, this._stuff[room] || new Map())
    this._stuff.get(room).set(id, stuff)
  }

  checkout(id) {
    if (!id)
      return

    const room = this._rooms.get(id)
    this._rooms.delete(id)

    this._stuff.get(room).delete(id)
    if (!this._stuff.get(room).size) {
      // TODO also cleanup other room resources like the associated Boardgame.io Game?
      this._stuff.delete(room)
    }
  }

  room(id) {
    return this._rooms.get(id)
  }

  stuff(room) {
    return this._stuff.get(room)
  }
}
