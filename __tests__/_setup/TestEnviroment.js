const NodeEnvironment = require('jest-environment-node');
const { Models } = require('./../../src/database/index')

const { TEARDOWN } = process.env

class TestEnviroment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context)

    this.shouldTeardown = (TEARDOWN || '').toUpperCase() === 'TRUE'
  }

  async setup() {
    await super.setup();
  }

  async teardown() {
    if (!this.shouldTeardown) {
      console.log('Test Enviroment Tear Down - SKIPPING')
      return
    }

    try {
      console.log('Test Enviroment Tear Down')

      // Remove Foreign key Checks      
      await Models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })

      // Truncate All Tables
      const IGNORE = ['Sequelize', 'sequelize']

      for (let m in Models) {
        if (IGNORE.includes(m) || Models[m].isStatic) { continue }

        if (Models[m].destroy)
          await Models[m].destroy({ truncate: true, force: true, cascade: false })
      }

    } catch (err) {
      console.error('!-- TearDown Error --!', err)
      throw err
    }
  }
}

module.exports = TestEnviroment