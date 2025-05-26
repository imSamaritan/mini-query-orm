function selectAll() {
  this.$select = `SELECT`
  this.$all = `* FROM ${this.$table}`
  this.$query = [this.$select, this.$all]

  return this
}

function order(details, order = "D") {
  if (order === "A") order = "ASC"
  else order = "DESC"

  if (Array.isArray(details.by)) {
    this.$orderBy = ` ORDER BY ${details.by.join(", ")} ${order}`
  } else {
    this.$orderBy = ` ORDER BY ${details.by} ${order}`
  }
  this.$query = [...this.$query, this.$orderBy]

  return this.run()
}

module.exports = {
  selectAll,
  order,
}
