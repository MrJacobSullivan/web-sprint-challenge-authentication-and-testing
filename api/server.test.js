const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

const bcrypt = require('bcryptjs')
const { BCRYPT_ROUNDS } = require('../config')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(() => {
  const users = [
    { username: 'jacob', password: bcrypt.hashSync('1234', BCRYPT_ROUNDS) },
    { username: 'emma', password: bcrypt.hashSync('1234', BCRYPT_ROUNDS) },
  ]

  users.forEach(async (user) => {
    db('users').insert(user)
  })
})

afterAll(async () => {
  await db.destroy()
})

it('is the correct env', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})

describe('users router', () => {
  describe('[POST] /api/auth/register', () => {
    let res

    // beforeEach(async () => {})
  })

  describe('[POST] /api/auth/login', () => {})
})

describe('jokes router', () => {})
