const helmet = require('helmet')
const express = require('express')
const cookieParser = require('cookie-parser')

const {
  RouterMisc, RouterAuth, RouterProject, RouterTask
} = require('./../routers')
const { ControllerAuth } = require('./../controllers')
const { ErrorHandler } = require('./../errors')

const app = express()

app.use(helmet())
app.use(cookieParser())
app.use(express.json())

//:: Misc Router - Ping / Version
app.use(RouterMisc)

app.use('/auth', RouterAuth)

app.use(ControllerAuth.authenticate())

app.use('/tasks', RouterTask)
app.use('/projects', RouterProject)

app.use(ErrorHandler)
app.use(async (_, res) => res.status(404).send('Unknown route'))

module.exports = app