const db = require('../../data/dbConfig')

const get = () => db('users')

const getBy = (filter) => db('users').where(filter).first()

const insert = (user) => {
  return db('users')
    .insert(user)
    .then(([id]) => getBy({ id }))
}

module.exports = {
  get,
  getBy,
  insert,
}
