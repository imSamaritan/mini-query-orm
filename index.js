const { initDB } = require("./model/model")

//instantiate Database
const connectionString = process.env.CONNECTION

module.exports = initDB(connectionString)
