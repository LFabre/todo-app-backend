const { ErrorCustom } = require('./Errors')
const { ValidationError } = require('express-validation')

//const EXCLUDE_4KST_LOG = [ErrorInvalidJWT]

module.exports = function (err, _req, res, _next) {
  if (err instanceof ErrorCustom) {
    return err.sendError(res)
  }

  if (err instanceof ValidationError) {
    // console.log('Validation Error')
    // console.log(err.details)
    return res.status(err.statusCode).json(err)
  }

  if (err instanceof SyntaxError) {
    console.log('Syntax Error')
    console.log(err)
    return res.status(err.status).json(err)
  }

  console.error(err)
  err.status ? res.status(err.status) : res.status(500)
  return res.send(err)
}