const { Joi } = require('express-validation')

module.exports = {
  body: Joi.object({
    name: Joi.string().max(75).required(),
    description: Joi.string().max(300).allow(null, '')
  })
}