const api = require("./model/model")
const exec = require("./execution/execute")

//instantiate Database
const connectionString = process.env.CONNECTION

//instantiate model and connect to Database
const model = api.initDB(connectionString, exec)

async function courses() {
  return await model
    .table("courses")
    .select(["id", "name", "title"])
    .where(["id", ">=", 2])
    .done()
}

async function display() {
  const coursesList = await courses()
  console.log(coursesList)
}

display()
