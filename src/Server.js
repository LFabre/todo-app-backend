require('dotenv').config()

const { Models } = require('./database')
const { MainApp } = require('./apps')

const { SV_PORT, DB_NAME } = process.env

//:: Starts Database connection pool
Models.sequelize.sync().then(() => {
  console.log(`[BOOT][CONNECT DATABASE][${DB_NAME}][SUCCESS]`)

  MainApp.listen(SV_PORT || 3001, () => {
    console.log(`[BOOT][LISTEN][SUCCESS][PORT ${SV_PORT}]`)
  })

}).catch(err => console.error('[BOOT][CONNECT DATABASE][ERROR]', err))
