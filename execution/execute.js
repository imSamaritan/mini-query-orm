const select = async (query, _this) => {
  try {
    const db = await _this.dbConnection
    const [data] = await db.execute(query)

    return data
  } catch (error) {
    throw new Error(error)
  }
}

const selectAll = async (query, db) => {
  // const db = await _this.dbConnection
  const [data] = await db.execute(query)

  return data
}

const insert = async (query, values, db) => {
  try {
    const [results] = await db.execute(query, values)
    return results
  } catch (error) {
    throw error
  }
}

const _delete = async (query, db) => {
  try {
    const results = await db.execute(query)
    return results
  } catch (error) {
    throw error
  }
}

module.exports = { select, selectAll, insert, _delete }
