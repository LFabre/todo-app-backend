require('dotenv').config({ path: process.cwd() + '/__tests__/_setup/test.env' });

const { sleep } = require('../../src/utils');
const { Models } = require('./../../src/database')
const { DB_NAME, DB_HOST, TEARDOWN } = process.env

// Prevents running test outside Test Database
if (!DB_NAME.includes('test')) {
  throw new Error('!-- NOT USING A TEST DATABASE --!')
}

// Prevents running test outside Local Machine
if (DB_HOST !== 'localhost') {
  throw new Error('!-- NOT USING LOCALHOST DATABASE --!')
}

module.exports = async function () {
  try {

    // Without TEARDOWN Database wont't reset at the end each test file.
    // This is useful to inspect the database state after a test file 
    // has been runned. But sometimes it will cause related tests to fail, 
    // since they may try to insert the same information.
    if (TEARDOWN !== 'TRUE') {
      console.log('\nTest TEARDOWN not enable.')
      console.error('\nSome tests might fail.')
      await sleep(5000)
    }

    console.log('\nGlobal Setup - Start')

    console.log(`\tStarting Clean DataBase - ${DB_NAME}`)

    // Starts new Database
    await Models.sequelize.sync({ force: true })

    console.log('Global Setup - End\n')
  } catch (err) {
    console.error('!-- GLOBAL TEST SET UP FAILED --!', err)
    process.exit(-9)
  }
}