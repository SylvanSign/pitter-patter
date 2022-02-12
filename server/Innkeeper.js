import MAPS, { defaultMap } from '../src/maps'

export default class InnKeeper {
  constructor(db) {
    this._stuff = new Map()
    this._timeoutRefs = new Map()
    this._db = db
  }

  checkin(stuff, room) {
    const { id } = stuff

    if (!this._stuff.has(room)) {
      this._stuff.set(room, {
        connected: new Set(),
        data: new Map(),
        // TODO do we need to initialize these?
        matchID: undefined,
        map: defaultMap,
        options: {
          audio: false,
          items: true,
        },
      })
    }
    const roomStuff = this._stuff.get(room)
    roomStuff.connected.add(id)
    roomStuff.data.set(id, stuff)
  }

  checkout(id, room) {
    if (!(id && room))
      return

    const stuff = this._stuff.get(room)
    if (!stuff)
      return

    if (!stuff.matchID) {
      // transient tenants okay because we haven't started a match yet
      stuff.data.delete(id)
    }
    const connected = stuff.connected
    connected.delete(id)

    if (!connected.size) {
      // TODO also cleanup other room resources like the associated Boardgame.io Game?
      clearTimeout(this._timeoutRefs.get(room))

      const ref = setTimeout(async () => {
        if (!connected.size) {
          const matchID = this.matchID(room)
          this._stuff.delete(room)
          if (matchID)
            await this._db.wipe(matchID)
        }
        this._timeoutRefs.delete(room)
      }, 10_000)

      this._timeoutRefs.set(room, ref)
    }
  }

  open(room, id) {
    const openButNotYetStarted = this._stuff.has(room) && !this.matchID(room)
    const closedButYouAreInAlready = this._stuff.has(room) && this.stuff(room).has(id)
    return openButNotYetStarted || closedButYouAreInAlready
  }

  stuff(room) {
    return this._stuff.get(room).data
  }

  stuffs(room) {
    return [...this.stuff(room).values()]
  }

  size(room) {
    return this.stuff(room).size
  }

  map(room) {
    return this._stuff.get(room).map
  }

  updateMap(room, map) {
    this._stuff.get(room).map = map
  }

  option(room, name) {
    return this._stuff.get(room).options[name]
  }

  updateOption(room, name, value) {
    this._stuff.get(room).options[name] = value
  }

  matchID(room) {
    return this._stuff.get(room).matchID
  }

  setMatchID(room, matchID) {
    this._stuff.get(room).matchID = matchID
  }
}
