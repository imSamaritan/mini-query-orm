function select(column) {
  this.$method = "select"

  if (Array.isArray(column)) {
    column = column.join(", ")
  }

  this.$select = `SELECT ${column} FROM ${this.$table}`
  this.$query = [this.$select]

  return this
}

function selectAll() {
  this.$method = "selectAll"

  this.$select = `SELECT`
  this.$all = `* FROM ${this.$table}`
  this.$query = [this.$select, this.$all]

  return this
}

function where(_where = []) {
  const _length = _where.length

  if (_length < 1) {
    console.log(
      "[field, operator, value] or [field, value] required in where()"
    )
    return this
  } else if (_length === 2) {
    const [column, value] = _where
    this.$where += `${column} = ${value}`
  } else if (_length === 3) {
    const [column, operator, value] = _where
    this.$where += `${column} ${operator} ${value}`
  }

  this.$query = [...this.$query, this.$where]
  return this
}

function and() {
  this.$where = ""
  this.$query = [...this.$query, this.$and]
  return this
}

function order(details, order = "D") {
  let orderby

  if (order.toLocaleUpperCase() === "A") {
    order = `ASC`
  } else {
    order = `DESC`
  }

  if (Array.isArray(details.by)) {
    orderby = details.by.join(", ")
  } else {
    orderby = details.by
  }

  this.$orderBy = `ORDER BY ${orderby} ${order}`
  this.$query = [...this.$query, this.$orderBy]

  return this
}

function limit(limit, offset = null) {
  this.$limit = `LIMIT ${limit}`

  if (offset) {
    this.$limit += `OFFSET ${offset}`
  }

  this.$query = [...this.$query, this.$limit]
  return this
}

module.exports = {
  select,
  selectAll,
  where,
  and,
  order,
  limit,
}
