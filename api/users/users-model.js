const db = require('../../data/dbConfig')

const get = () => db('users')

const getBy = (filter) => db('users').where(filter).first()

const insert = (user) => {
  return db('users')
    .insert(user)
    .then(([id]) => getBy({ id }))
}

const update = (id, user) => {
  return db('users')
    .update(user)
    .where({ id })
    .then(() => getBy({ id }))
}

const remove = (id) => {
  return db('users')
    .delete()
    .where({ id })
    .then(() => parseInt(id))
}

module.exports = {
  get,
  getBy,
  insert,
  update,
  remove,
}
