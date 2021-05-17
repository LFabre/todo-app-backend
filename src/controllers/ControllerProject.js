const Controller = require('./Controller')
const { Models, DaoProject, DaoTask } = require('../database')

/**
 * Provides Project related middlewares.
 *
 * @author Lucas Fabre
 * @date 2021-05-15
 * @class ControllerProject
 * @extends {Controller}
 */
class ControllerProject extends Controller {
  constructor() {
    super()
    this._daoTask = new DaoTask(Models)
    this._daoProject = new DaoProject(Models)
  }

  /**
   * Middleware to validade the relationship between the current
   * logged in user and the specified project on the URL params. 
   * If the project can not be found error code 404 will be returned.
   * If the project does not belong to the user, error code 403 will be returned
   * If the project belongs to the user, the project data will be saved on 
   * req.locals.project in other to be available for the incoming middlewares
   * If the query parameter `includeTasks` is true, the project will be returned with
   * task information.
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} req.params.projectId
   * @param {bool} req.query.includeTasks
   * @memberof ControllerProject
   */
  _validateProjectOwnership() {
    return async (req, res, next) => {
      let p
      const { userId } = req.locals
      const { projectId } = req.params
      const { includeTasks } = req.query

      try {
        if (includeTasks)
          p = await this._daoProject.findByPkIncludeTasks(projectId)
        else
          p = await this._daoProject.findByPk(projectId)

        // Project does not exists
        if (!p) {
          return res.sendStatus(404)
        }

        // Project does not belong to the authenticated user
        if (p.user_id !== userId) {
          return res.sendStatus(403)
        }

        req.locals.project = p
        next()
      } catch (err) {
        next(err)
      }
    }
  }

  /**
   * Gets all Projects from authenticated user, including Task information.
   * If the query parameter `projectOnly` is present,
   * task information of each project will not be returned.
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @return {object} 
   * @memberof ControllerProject
   */
  getAllByUserId() {
    return async (req, res, next) => {
      const { userId } = req.locals
      const { projectOnly } = req.query

      try {
        let data

        if (projectOnly)
          data = await this._daoProject.findAllByUserId(userId)
        else
          data = await this._daoProject.findAllByUserIdIncludeTasks(userId)

        res.send(data)
      } catch (err) {
        next(err)
      }
    }
  }

  /**
   * Get Project specified on URL Params
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} req.params.projectId
   * @param {bool} req.query.includeTasks
   * @return {*} 
   * @memberof ControllerProject
   */
  getProjectById() {
    return [
      this._validateProjectOwnership(),
      async (req, res, next) => {
        try {
          res.send(req.locals.project)
        } catch (err) {
          next(err)
        }
      }
    ]
  }

  /**
   * Creates new project for the authenticated user
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {string} req.body.name
   * @param {string} req.body.description
   * @return {*} 
   * @memberof ControllerProject
   */
  postProject() {
    return async (req, res, next) => {
      const { userId: user_id } = req.locals
      const { name, description } = req.body

      try {
        let p = await this._daoProject.create({
          user_id, name, description
        })

        res.send(p)
      } catch (err) {
        next(err)
      }
    }
  }

  /**
   * Edits project
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} req.params.projectId
   * @param {string} req.body.name
   * @param {string} req.body.description
   * @return {*} 
   * @memberof ControllerProject
   */
  putProject() {
    return [
      this._validateProjectOwnership(),
      async (req, res, next) => {
        const { projectId } = req.params
        const { name, description } = req.body

        try {

          await this._daoProject.updateByPk(projectId, {
            name, description
          })

          res.sendStatus(204)
        } catch (err) {
          next(err)
        }
      }
    ]
  }

  /**
   * Delete Project
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} req.params.projectId
   * @memberof ControllerProject
   */
  deleteProject() {
    return [
      this._validateProjectOwnership(),
      async (req, res, next) => {
        let transaction
        const { projectId } = req.params

        try {
          // Since we are using Soft Delete, Sequelize is 
          // not able to handle cascade deletion. It must be handled manually

          transaction = await this._daoProject.startTransaction()

          await this._daoProject.destroyByPk(projectId, { transaction })
          await this._daoTask.destroyByProjectId(projectId, { transaction })

          await transaction.commit()

          res.sendStatus(204)
        } catch (err) {
          if (transaction) { await transaction.rollback() }
          next(err)
        }
      }
    ]
  }

  /**
   * Creates new Task on the specified Project
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} req.params.projectId
   * @return {*} 
   * @memberof ControllerProject
   */
  postProjectTask() {
    return [
      this._validateProjectOwnership(),
      async (req, res, next) => {
        const { projectId } = req.params

        try {

          let task = await this._daoTask.create({
            ...req.body,
            project_id: Number(projectId),
          })

          res.send(task)
        } catch (err) {
          next(err)
        }
      }
    ]
  }

  /**
 * Gets all Tasks of the specified Project
 *
 * @author Lucas Fabre
 * @date 2021-05-15
 * @param {number} req.params.projectId
 * @return {*} 
 * @memberof ControllerProject
 */
  getProjectTask() {
    return [
      this._validateProjectOwnership(),
      async (req, res, next) => {
        const { projectId } = req.params

        try {

          let tasks = await this._daoTask.findAllByProjectId(projectId)

          res.send(tasks)
        } catch (err) {
          next(err)
        }
      }
    ]
  }
}

module.exports = ControllerProject