const mysql = require('mysql2')
const connectionDebugger = require('debug')('db:connection')
require('dotenv').config()

const limit = parseInt(process.env.CONNECTION_LIMIT) || 10

const connect = async (settings) => {
  let pool = null
  const poolConfig = {
    ...settings,
    waitForConnections: true,
    connectionLimit: limit,
  }

  try {
    pool = mysql.createPool(poolConfig)
  } catch (error) {
    throw error
  }

  connectionDebugger(`Config : ${JSON.stringify(settings, null, 2)}`)
  connectionDebugger(`Connection limit : ${limit}`)

  return pool.promise()
}

module.exports = { connect }
