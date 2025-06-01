function selectAll() {
  this.$method = "selectAll"

  this.$select = `SELECT`
  this.$all = `* FROM ${this.$table} `
  this.$query = [this.$select, this.$all]

  return this
}

function order(details, order = "D") {
  if (order === "A") order = "ASC"
  else order = "DESC"

  if (Array.isArray(details.by))
    this.$orderBy = ` ORDER BY ${details.by.join(", ")} ${order} `
  else this.$orderBy = ` ORDER BY ${details.by} ${order} `

  this.$query = [...this.$query, this.$orderBy]
  return this
}

function limit(limit, offset = null) {
  this.$limit = ` LIMIT ${limit} `
  if (offset) {
    this.$limit += ` OFFSET ${offset} `
  }

  this.$query = [...this.$query, this.$limit]
  return this
}

module.exports = {
  selectAll,
  order,
  limit,
}
