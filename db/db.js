const mysql = require("mysql2")
const connectionDebugger = require("debug")("db:connection")
require("dotenv").config()

const limit = parseInt(process.env.CONNECTION_LIMIT) || 10

const connect = async (settings) => {
  const poolConfig = {
    ...settings,
    waitForConnections: true,
    connectionLimit: limit,
  }

  const pool = mysql.createPool(poolConfig)

  connectionDebugger(`Config : ${JSON.stringify(settings, null, 2)}`)
  connectionDebugger(`Connection limit : ${limit}`)

  return pool.promise()
}

module.exports = { connect }
