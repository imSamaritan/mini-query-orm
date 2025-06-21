const select = async (query, db, values = []) => {
  try {
    const [data] = await db.execute(query, values)
    return data
  } catch (error) {
    throw new Error(error)
  }
}

const selectAll = async (query, db, values = []) => {
  // const db = await _this.dbConnection
  try {
    const [data] = await db.execute(query, values)
    return data
  } catch (error) {
    throw error
  }
}

const insert = async (query, db, values = []) => {
  try {
    const [results] = await db.execute(query, values)
    return results
  } catch (error) {
    throw error
  }
}

const update = async (query, db, values = []) => {
  try {
    const [results] = await db.execute(query, values)
    return results
  } catch (error) {
    throw error
  }
}

const _delete = async (query, db, values = []) => {
  try {
    const results = await db.execute(query, values)
    return results
  } catch (error) {
    throw error
  }
}

module.exports = { select, selectAll, insert, update, _delete }
