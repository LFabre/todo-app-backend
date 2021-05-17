const { Router } = require('express')
const { validate } = require('express-validation')
const { ValidationTask } = require('./../validations')
const { ControllerTask } = require('./../controllers')

const ID = ':taskId(\\d+)'
const router = Router()

// Delete / Get Task
router.route(`/${ID}`)
  .get(ControllerTask.getTaskById())
  .delete(ControllerTask.deleteTask())

router.put(`/${ID}/set/finished`, ControllerTask.setTaskAsFinished())
router.put(`/${ID}/set/unfinished`, ControllerTask.setTaskAsUnFinished())

// Edit Taks
router.use(validate(ValidationTask))
router.put(`/${ID}`, ControllerTask.putTask())

module.exports = router