const { connect } = require("../db/db")
const methods = require("../methods/methods")

class Database {
  constructor(credentials) {
    this.$table = ""
    this.$query = []

    this.$select = ""
    this.$all = ""
    this.$where = ""
    this.$orderBy = ""

    this.dbConnection = (async () => {
      this.table(credentials.table)
      delete credentials.table

      try {
        return await connect(credentials)
      } catch (error) {
        throw error
      }
    })()

    //Run queries
    this.$query.length > 0 ? this.run() : null
  }

  table(tableName) {
    this.$table = tableName
    return this
  }

  reset() {
    const props = Object.keys(this)
    for (const prop of props) {
      if (prop.startsWith("$")) {
        this[prop] = ""
      }
    }
  }

  async run() {
    const dbInstance = await this.dbConnection
    const query = this.$query.join(" ") + ";"
    const [data] = await dbInstance.execute(query)

    this.reset()
    return data
  }
}

Object.assign(Database.prototype, methods)

const initDB = (dsn) => {
  let index = 0
  const credential = {}

  dsn = dsn.split(";")
  dsn = dsn.map((string) => string.split("="))

  const getCredentials = () => {
    const key = dsn[index][0]
    const value = dsn[index][1]
    const length = dsn.length - 1

    credential[key] = value

    if (index === length) {
      return credential
    } else {
      index += 1
      return getCredentials()
    }
  }
  const creds = getCredentials()
  return new Database(creds)
}

module.exports = { initDB }
