const { connect } = require('../db/db')
const methods = require('../methods/methods')
const inspectQuery = require('debug')('mini-orm:query')
const inspectBuilder = require('debug')('mini-orm:query-builder')
const inspectResetProps = require('debug')('mini-orm:reset')

class MiniORM {
  #exec
  static #credentials
  static #connection = null
  static #tableName

  constructor(credentials, exec) {
    this.#exec = exec
    MiniORM.#credentials = credentials

    this.$table = ''
    this.$method = ''
    this.$query = []

    this.$select = ''
    this.$all = ''
    this.$where = 'WHERE '
    this.$and = 'AND'
    this.$or = 'OR'
    this.$like = 'LIKE '
    this.$orderBy = ''
    this.$limit = 'LIMIT '

    this.defaultProps = {
      $where: 'WHERE ',
      $and: 'AND',
      $or: 'OR',
      $like: 'LIKE ',
      $limit: 'LIMIT ',
    }
  }

  static async getConnection() {
    //Remember to set a default table name which...
    // might comes with connection settings

    try {
      if (!MiniORM.#connection) {
        MiniORM.#connection = await connect(MiniORM.#credentials)
      }
      return MiniORM.#connection
    } catch (error) {
      throw error
    }
  }

  table(tableName) {
    this.$table = tableName || MiniORM.#tableName
    return this
  }

  reset() {
    const props = Object.keys(this)
    inspectQuery(`SQL: ${this.$query.join(' ')};`)

    for (const prop of props) {
      if (prop.startsWith('$')) {
        inspectBuilder(`builder: [${prop}] : ${this[prop]}`)

        if (Array.isArray(this[prop])) {
          this[prop] = []
        } else if (prop in this.defaultProps) {
          this[prop] = this.defaultProps[prop]
        } else if (typeof this[prop] === 'object' && this[prop] !== null) {
          this[prop] = {}
        } else if (prop != '$table') {
          this[prop] = ''
        }
      }
    }
    inspectResetProps('Reset:', this)
  }

  async done() {
    // this.reset()
    // return

    //Get connect to MiniORM
    const db = await MiniORM.getConnection()

    const query = this.$query.join(' ') + ';'
    const results = await this.#exec[this.$method](query, db)

    this.reset()
    return results
  }
}

//Compose methods from methods.js module
Object.assign(MiniORM.prototype, methods)

//Parse connection string into an object
const getCredentialsFromURI = (URI) => {
  URI = URI.split(';')
  const credentials = {}

  for (const uriString of URI) {
    const [key, value] = uriString.split('=')
    credentials[key] = value
  }

  return credentials
}

//MiniORM initializer
const initDB = (URI, exec) => {
  const credentials = getCredentialsFromURI(URI)
  return new MiniORM(credentials, exec)
}

module.exports = { initDB }
