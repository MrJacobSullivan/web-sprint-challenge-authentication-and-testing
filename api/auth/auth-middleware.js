const Users = require('../users/users-model')
const { requiredString } = require('../middleware/validation')

const validateUsernameAndPassword = (req, res, next) => {
  const { username, password } = req.body

  const passes = requiredString(username) && requiredString(password)

  if (!passes) {
    return next({ status: 401, message: 'username and password required' })
  }

  req.user = { username, password }
  next()
}

const validateUsernameIsUnique = (req, res, next) => {
  const { username } = req.user

  Users.getBy({ username }).then((user) => {
    if (user) {
      return next({ status: 401, message: 'username taken' })
    }

    next()
  })
}

module.exports = {
  validateUsernameAndPassword,
  validateUsernameIsUnique,
}
