const express = require('express')
const dotenv = require('dotenv')
const miniORM = require('./model/model')
const exec = require('./execution/execute')

dotenv.config()

const app = express()
const connectionString = process.env.CONNECTION
const model = miniORM.initDB(connectionString, exec).table('courses')

app.use(express.json())

app.get('/', async (req, res) => {
  return res.redirect('/courses')
})

app.get('/courses', async (req, res) => {
  const limit = parseInt(req.query.limit) || 1000000

  try {
    const courses = await model
      .selectAll()
      .order({ by: 'title' })
      .limit(limit)
      .done()
    return res.json(courses)
  } catch (error) {
    throw error
  }
})

app.get('/courses/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const data = await model.selectAll().where(['id', id]).done()

    return res.json(data)
  } catch (error) {
    throw error
  }
})

app.post('/courses', async (req, res) => {
  const { body } = req
  const course = await model.insert(body).done()

  res.json(course)
})

app.delete('/courses/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const data = await model._delete().where(['id', id]).done()

    return res.json(data)
  } catch (error) {
    console.log(error)
  }
})

app.listen(4500, () => console.log('Server started...4500'))
