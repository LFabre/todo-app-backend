const { Joi } = require('express-validation')

const DATE_REGEX = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/

module.exports = {
  body: Joi.object({
    name: Joi.string().max(75).required(),
    description: Joi.string().max(300).allow(null, ''),

    //:: TODO - Improve Date Validation
    termination_date: Joi.string().regex(DATE_REGEX).allow(null),    
  })
}