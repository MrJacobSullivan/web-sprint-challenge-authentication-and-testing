const router = require('express').Router()
const bcrypt = require('bcryptjs')

const { BCRYPT_ROUNDS } = require('../../config')

const { tokenBuilder } = require('./auth-helpers')
const { validateUsernameAndPassword, validateUsernameIsUnique } = require('./auth-middleware')

const Users = require('../users/users-model')

// [POST] /api/auth/register
router.post(
  '/register',
  [validateUsernameAndPassword, validateUsernameIsUnique],
  (req, res, next) => {
    const user = req.user
    const hash = bcrypt.hashSync(user.password, BCRYPT_ROUNDS)
    user.password = hash

    Users.insert(user)
      .then((saved) => {
        res.status(201).json(saved)
      })
      .catch(next)
  }
)

// [POST] /api/auth/login
router.post('/login', validateUsernameAndPassword, (req, res, next) => {
  const { username, password } = req.user

  Users.getBy({ username })
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = tokenBuilder(user)

        return res.status(200).json({
          message: `welcome, ${user.username}`,
          token,
        })
      }

      next({ status: 401, message: 'invalid credentials' })
    })
    .catch(next)
})

module.exports = router
