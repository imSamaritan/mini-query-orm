function select(column) {
  this.$method = 'select'

  if (Array.isArray(column)) {
    column = column.join(', ')
  }

  this.$select = `SELECT ${column} FROM ${this.$table}`
  this.$query = [this.$select]

  return this
}

function selectAll() {
  this.$method = 'selectAll'

  this.$select = `SELECT`
  this.$all = `* FROM ${this.$table}`
  this.$query = [this.$select, this.$all]

  return this
}

function insert(data) {
  this.$method = 'insert'
  // {name: "imsamaritan", title: "My Title", isPublished: 1}
  const columnsFromKeys = Object.keys(data)
  const valuesPlaceholder = columnsFromKeys.map((column) => '?')

  for (const key of columnsFromKeys) {
    this.$values.push(data[key])
  }

  this.$insert = `
    INSERT INTO ${this.$table} (${columnsFromKeys.join(' ,')})
    VALUES (${valuesPlaceholder.join(' ,')})
  `

  this.$query = [this.$insert]
  return this
}

function update(data = {}) {
  this.$method = 'update'

  const keys = Object.keys(data)
  const fields = keys.map((column) => `${column} = ?`)

  for (const key of keys) {
    this.$values.push(data[key])
  }

  this.$update += `${this.$table} SET ${fields.join(', ')}`
  this.$query = [this.$update]

  return this
}

function _delete() {
  this.$method = '_delete'

  this.$_delete += `${this.$table}`
  this.$query = [this.$_delete]

  return this
}

function where(_where = {}) {
  let config = Object.keys(_where)

  if (config.length < 1) {
    console.log('Field and value require {columName:value}')
    return this
  }
  else if ('operator' in _where) {
    config = config.filter((key) => key != 'operator')
    const column = config[0]
    const value = _where[config[0]]
    const { operator } = _where

    this.$where += `${column} ${operator} ?`
    this.$values.push(value)
  }
  else {
    const column = config[0]
    const value = _where[config[0]]

    this.$where += `${column} = ?`
    this.$values.push(value)
  }

  this.$query = [...this.$query, this.$where]
  return this
}

function and() {
  this.$where = ''
  this.$query = [...this.$query, this.$and]
  return this
}

function or() {
  this.$where = ''
  this.$query = [...this.$query, this.$or]
  return this
}

function like(_obj, matchFrom) {
  const [key] = Object.keys(_obj)
  this.$where += key

  if (matchFrom === 'start') this.$like += `'${_obj[key]}%'`
  if (matchFrom === 'end') this.$like += `'%${_obj[key]}'`
  if (!matchFrom || matchFrom === '') this.$like += `'%${_obj[key]}%'`

  this.$query = [...this.$query, this.$where, this.$like]
  //Reset like props to default incase like is used more than once in a query
  this.$like = 'LIKE '
  return this
}

function order(details, order = 'D') {
  let orderby

  if (order.toLocaleUpperCase() === 'A') {
    order = `ASC`
  } else {
    order = `DESC`
  }

  if (Array.isArray(details.by)) {
    orderby = details.by.join(', ')
  } else {
    orderby = details.by
  }

  this.$orderBy = `ORDER BY ${orderby} ${order}`
  this.$query = [...this.$query, this.$orderBy]

  return this
}

function limit(limit, offset = null) {
  this.$limit += `${limit}`

  if (offset) {
    this.$limit += `OFFSET ${offset}`
  }

  this.$query = [...this.$query, this.$limit]
  return this
}

module.exports = {
  select,
  selectAll,
  insert,
  update,
  _delete,
  where,
  and,
  or,
  like,
  order,
  limit,
}
