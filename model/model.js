const { connect } = require("../db/db")
const methods = require("../methods/methods")

class Database {
  constructor(credentials, exec) {
    this.exec = exec
    this.$table = ""
    this.$query = []

    this.$select = ""
    this.$all = ""
    this.$where = ""
    this.$orderBy = ""
    this.$method = ""

    this.dbConnection = (async () => {
      this.table(credentials.table)
      delete credentials.table

      try {
        return await connect(credentials)
      } catch (error) {
        throw error
      }
    })()
  }

  table(tableName) {
    this.$table = tableName
    return this
  }

  reset() {
    const props = Object.keys(this)
    for (const prop of props) {
      if (prop.startsWith("$")) {
        if (Array.isArray(this[prop])) {
          this[prop] = []
        }

        if (typeof this[prop] === "object") {
          this[prop] = {}
        }

        this[prop] = ""
      }
    }
  }

  async done() {
    const query = this.$query.join(" ") + ";"
    return await this.exec[this.$method](query, this)
  }
}

Object.assign(Database.prototype, methods)

const initDB = (dsn, exec) => {
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
  return new Database(creds, exec)
}

module.exports = { initDB }
