const requiredString = (str) => {
  return typeof str === 'string' && str !== undefined
}

module.exports = {
  requiredString,
}
