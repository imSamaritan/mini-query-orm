const dotenv = require("dotenv")
const miniOrm = require("./model/model")
const exec = require("./execution/execute")

dotenv.config()
//instantiate Database
const connectionString = process.env.CONNECTION

//instantiate model and connect to Database
const model = miniOrm.initDB(connectionString, exec)

async function courses() {
  return await model.table("courses").selectAll().done()
}

async function display() {
  const coursesList = await courses()
  console.log(coursesList)
}

display()
