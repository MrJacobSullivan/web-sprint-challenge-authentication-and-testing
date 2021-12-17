const db = require('../../data/dbConfig')

const bcrypt = require('bcryptjs')
const { BCRYPT_ROUNDS } = require('../../config')

const mockPassword = (password = '1234') => bcrypt.hashSync(password, BCRYPT_ROUNDS)

// seed the db with some test users
const seedDb = () => {
  const users = [
    { username: 'jacob', password: mockPassword() },
    { username: 'emma', password: mockPassword('hunter2') },
  ]

  users.forEach(async (user) => {
    await db('users').insert(user)
  })
}

module.exports = {
  mockPassword,
  seedDb,
}
