const { connect } = require("../db/db")
const methods = require("../methods/methods")
const inspectQuery = require("debug")("mini-orm:query")
const inspectBuilder = require("debug")("mini-orm:query-builder")

class Database {
  constructor(credentials, exec) {
    this.exec = exec
    this.$table = ""
    this.$method = ""
    this.$query = []

    this.$select = ""
    this.$all = ""
    this.$where = "WHERE "
    this.$and = "AND"
    this.$or = "OR"
    this.$orderBy = ""
    this.$limit = ""

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
    inspectQuery(`SQL: ${this.$query.join(" ")};`)

    for (const prop of props) {
      if (prop.startsWith("$")) {
        inspectBuilder(`builder: [${prop}] : ${this[prop]}`)

        if (Array.isArray(this[prop])) {
          this[prop] = []
        } else if (typeof this[prop] === "object" && this[prop] !== null) {
          this[prop] = {}
        } else {
          this[prop] = ""
        }
      }
    }
  }

  async done() {
    const query = this.$query.join(" ") + ";"
    const results = await this.exec[this.$method](query, this)

    this.reset()

    return results
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
