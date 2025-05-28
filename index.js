const api = require("./model/model")

//instantiate Database
const connectionString = process.env.CONNECTION

//instantiate model and connect to Database
const model = api.initDB(connectionString)

async function courses() {
  return await model.table("courses").selectAll().order({ by: "name" })
}

async function display() {
  const coursesList = await courses()
  console.log(coursesList)
}

display()
