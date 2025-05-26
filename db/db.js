const mysql = require("mysql2")
const connectionDebugger = require("debug")("db:connection")

const connect = async (settings) => {
  const db = await mysql.createConnection(settings)

  db.connect((error) => {
    if (error) throw err
    else connectionDebugger(settings)
  })

  return db.promise()
}

module.exports = { connect }
