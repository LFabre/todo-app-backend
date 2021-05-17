const { Router } = require('express')
const { validate } = require('express-validation')
const { ValidationAuth } = require('./../validations')
const { ControllerAuth } = require('./../controllers')

const router = Router()

//:: Register User
router.post('/register',
  validate(ValidationAuth.user),
  ControllerAuth.registerUser()
)

//:: Login Route
router.post('/login', validate(ValidationAuth.login), ControllerAuth.login())

//:: Renew JWT
router.post('/reconnect', ControllerAuth.reconnect())

module.exports = router