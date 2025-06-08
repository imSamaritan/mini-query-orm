const { connect } = require("../db/db")
const methods = require("../methods/methods")
const inspectQuery = require("debug")("mini-orm:query")
const inspectBuilder = require("debug")("mini-orm:query-builder")
const inspectResetProps = require("debug")("mini-orm:reset")

class Database {
  #exec
  static #credentials
  static #connection = null
  static #tableName

  constructor(credentials, exec) {
    this.#exec = exec
    Database.#credentials = credentials

    this.$table = ""
    this.$method = ""
    this.$query = []

    this.$select = ""
    this.$all = ""
    this.$where = "WHERE "
    this.$and = "AND"
    this.$or = "OR"
    this.$like = "LIKE "
    this.$orderBy = ""
    this.$limit = "LIMIT "

    this.defaultProps = {
      $where: "WHERE ",
      $and: "AND",
      $or: "OR",
      $like: "LIKE ",
      $limit: "LIMIT ",
    }
  }

  static async getConnection() {
    //Remember to set a default table name which... 
    // might comes with connection settings

    try {
      if (!Database.#connection) {
        Database.#connection = await connect(Database.#credentials)
      }
      return Database.#connection
    } catch (error) {
      throw error
    }
  }

  table(tableName) {
    this.$table = tableName || Database.#tableName
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
        } else if (prop in this.defaultProps) {
          this[prop] = this.defaultProps[prop]
        } else if (typeof this[prop] === "object" && this[prop] !== null) {
          this[prop] = {}
        } else if (prop != "$table") {
          this[prop] = ""
        }
      }
    }
    inspectResetProps("Reset:", this)
  }

  async done() {
    // this.reset()
    // return

    //Get connect to database
    const db = await Database.getConnection()

    const query = this.$query.join(" ") + ";"
    const results = await this.#exec[this.$method](query, db)

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
