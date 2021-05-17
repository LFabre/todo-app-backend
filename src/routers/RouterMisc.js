const { Router } = require('express')

const router = Router()

//:: Ping
router.get('/ping', async (_, res) => {
  res.write('Pong!'); res.end();
})

//:: Version
router.get('/version', async (_, res) => {
  res.write('Todo App - V0.0.1'); res.end();
})

module.exports = router