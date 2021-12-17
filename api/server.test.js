const request = require('supertest')
const jwt_decode = require('jwt-decode')
const db = require('../data/dbConfig')
const server = require('./server')

const { mockPassword, seedDb } = require('./utils/test-helpers')

beforeEach(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()

  await seedDb() // seed db with test users
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

    const larry = { username: 'larry', password: mockPassword() }
    const expected = { username: 'larry', id: 3 }

    beforeEach(async () => {
      res = await request(server).post('/api/auth/register').send(larry)
    })

    it('responds with 201 create', () => {
      expect(res.status).toBe(201)
    })

    it('responds with new user', () => {
      expect(res.body).toMatchObject(expected)
      expect(res.body).toHaveProperty('password')
    })
  })

  describe('[POST] /api/auth/login', () => {
    let res

    const jacob = { username: 'jacob', password: '1234' }

    beforeEach(async () => {
      res = await request(server).post('/api/auth/login').send(jacob)
    })

    it('responds with 200 OK', () => {
      expect(res.status).toBe(200)
    })

    it('responds with a message containing the username', () => {
      expect(res.body.message).toBe(`welcome, ${jacob.username}`)
    })

    it('responds with a valid json web token', () => {
      const decoded = jwt_decode(res.body.token)
      expect(decoded).toMatchObject({ subject: 1, username: 'jacob' })
      expect(decoded).toHaveProperty('iat')
      expect(decoded).toHaveProperty('exp')
    })
  })
})

describe('jokes router', () => {
  describe('[GET] /api/jokes', () => {
    let res

    const jacob = { username: 'jacob', password: '1234' }

    describe('authenticated access', () => {
      beforeEach(async () => {
        res = await request(server).post('/api/auth/login').send(jacob)
        res = await request(server).get('/api/jokes').set('Authorization', res.body.token)
      })

      it('responds with 200 OK when user is authenticated', () => {
        expect(res.status).toBe(200)
      })

      it('responds with a list of dad jokes', () => {
        expect(res.body).toHaveLength(3)
      })
    })

    describe('unauthenticated access', () => {
      beforeEach(async () => {
        res = await request(server).get('/api/jokes').set('Authorization', 'foobar')
      })

      it('responds with 401 unauthorized when user is unauthenticated', () => {
        expect(res.status).toBe(401)
      })
    })
  })
})
