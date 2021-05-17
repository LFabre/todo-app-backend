const { Sequelize } = require('sequelize')

const ModelUser = require('./ModelUser')
const ModelTask = require('./ModelTask')
const ModelProject = require('./ModelProject')
const ModelUserAuth = require('./ModelUserAuth')

const {
  DB_HOST, DB_NAME, DB_USER, DB_PSWD,
  DB_PORT, DB_DIALECT, DB_LOG
} = process.env

// Sequelize Connection Object
const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PSWD,
  {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
    logging: DB_LOG === 'TRUE' ? console.log : false,
    timestamps: false,
    // Sequelize connection Pool
    pool: {
      max: 10,
      min: 0,
      idle: 15000,
    },
    decimalNumbers: true
  }
)

const Models = {
  Sequelize,
  sequelize,

  // Models
  User: ModelUser.init(sequelize, Sequelize),
  Task: ModelTask.init(sequelize, Sequelize),
  Project: ModelProject.init(sequelize, Sequelize),
  UserAuth: ModelUserAuth.init(sequelize, Sequelize),
}

//:: Associate Models
Object.keys(Models).forEach(key => {
  if (Models[key]['associate'])
    Models[key].associate(Models)
})

module.exports = Models