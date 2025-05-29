const selectAll = async (query, _this) => {
  const db = await _this.dbConnection
  const [data] = await db.execute(query)

  return data
}

const insert = async (query, values, _this) => {
  console.log("Insert")
}

module.exports = { selectAll, insert }
