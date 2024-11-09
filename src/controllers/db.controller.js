import { initializeApp } from 'firebase/app'
import { getDatabase, ref, get, set, child } from 'firebase/database'

export class DBController {
  host

  _dbRef

  constructor(host) {
    this.host = host

    host.addController(this)
  }

  hostConnected() {
    this.startDBConnection()
  }

  startDBConnection() {
    // eslint-disable-next-line no-undef
    const app = initializeApp(FIREBASE)

    this._dbRef = ref(getDatabase(app))
  }

  async getFormByKey(key) {
    try {
      const snapshot = await get(child(this._dbRef, `form/${key}`))

      if (snapshot.exists()) {
        const data = snapshot.val()

        data.fields = this.orderFieldsByOrder(data.fields)

        this.host.form = data
      }
    }
    catch(error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  async saveUserData(token, newData) {
    try {
      let data = newData
      const snapshot = await get(child(this._dbRef, `users/${token}`))

      if (snapshot.exists()) {
        data = Object.assign({}, snapshot.val(), newData)
      }

      set(child(this._dbRef, `users/${token}`), data)
    }
    catch(error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  orderFieldsByOrder(object, order = 'asc') {
    let objectOrdered = object

    objectOrdered = Object.fromEntries(
      Object.entries(object).sort(([,a], [,b]) => {
        if (order === 'asc') {
          return a.order - b.order
        }
        return b.order - a.order
      })
    )

    return objectOrdered
  }
}
