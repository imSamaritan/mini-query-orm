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

const insert = async (query, values, _this) => {
  console.log("Insert")
}

module.exports = { select, selectAll, insert }
