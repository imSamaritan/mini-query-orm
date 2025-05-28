const mysql = require("mysql2")
const connectionDebugger = require("debug")("db:connection")

const connect = async (settings) => {
  const db = mysql.createConnection(settings)

  db.connect((error) => {
    if (error) throw new Error(error)
    else connectionDebugger(settings)
  })

  return db.promise()
}

module.exports = { connect }
