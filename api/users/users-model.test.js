const db = require('../../data/dbConfig')
const Users = require('./users-model')

const bcrypt = require('bcryptjs')
const { BCRYPT_ROUNDS } = require('../../config')

beforeEach(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()

  // seed the db with some test users
  const users = [
    { username: 'jacob', password: bcrypt.hashSync('1234', BCRYPT_ROUNDS) },
    { username: 'emma', password: bcrypt.hashSync('hunter2', BCRYPT_ROUNDS) },
  ]

  users.forEach(async (user) => {
    await db('users').insert(user)
  })
})

afterAll(async () => {
  await db.destroy()
})

describe('users model', () => {
  describe('get', () => {
    it('resolves all users in users table', async () => {
      const result = await Users.get()
      expect(result).toHaveLength(2)
    })
  })

  describe('getBy', () => {
    const expected = { id: 1, username: 'jacob' }

    it('resolves a user with given id', async () => {
      const result = await Users.getBy({ id: 1 })
      expect(result).toMatchObject(expected)
    })

    it('resolves a user with a given username', async () => {
      const result = await Users.getBy({ username: 'jacob' })
      expect(result).toMatchObject(expected)
    })
  })

  describe('insert', () => {
    const input = { username: 'larry', password: bcrypt.hashSync('password1', BCRYPT_ROUNDS) }
    const expected = { id: 3, username: 'larry' }

    it('creates a new user in db', async () => {
      await Users.insert(input)
      const [larry] = await db('users').where({ id: 3 })
      expect(larry).toMatchObject(expected)
    })

    it('resolves the new user with id, username', async () => {
      const result = await Users.insert(input)
      expect(result).toMatchObject(expected)
    })
  })
})
