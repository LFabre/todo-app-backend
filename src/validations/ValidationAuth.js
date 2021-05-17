const { Joi } = require('express-validation')

const LOGIN_MATCH = /[a-zA-Z_]+/

module.exports = {
  login: {
    body: Joi.object({
      login: Joi.string().max(45).regex(LOGIN_MATCH).required(),
      password: Joi.string().required()
    })
  },
  user: {
    body: Joi.object({
      login: Joi.string().max(45).regex(LOGIN_MATCH).required(),
      password: Joi.string().max(45).required(),
      first_name: Joi.string().max(75).required(),
      last_name: Joi.string().max(75).required(),
    })
  }
}