function select(column) {
  this.$method = "select"

  if (Array.isArray(column)) {
    column = column.join(", ")
  }
  this.$select = ` SELECT ${column} FROM ${this.$table} `
  this.$query = [this.$select]
  return this
}

function selectAll() {
  this.$method = "selectAll"

  this.$select = `SELECT`
  this.$all = `* FROM ${this.$table} `
  this.$query = [this.$select, this.$all]

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
  order,
  limit,
}
