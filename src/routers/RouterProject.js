const { Router } = require('express')
const { validate } = require('express-validation')
const { ValidationProject, ValidationTask } = require('./../validations')
const { ControllerProject } = require('./../controllers')

const ID = ':projectId(\\d+)'
const router = Router()

// Get All Projects
router.get('/', ControllerProject.getAllByUserId())

// Delete / Get Project
router.route(`/${ID}`)
  .get(ControllerProject.getProjectById())
  .delete(ControllerProject.deleteProject())

// Create new Project Task
router.post(`/${ID}/task`,
  validate(ValidationTask),
  ControllerProject.postProjectTask()
)

// Get Project Tasks
router.get(`/${ID}/task`, ControllerProject.getProjectTask())

// Create and Edit Project
router.use(validate(ValidationProject))

router.post('/', ControllerProject.postProject())
router.put(`/${ID}`, ControllerProject.putProject())

module.exports = router