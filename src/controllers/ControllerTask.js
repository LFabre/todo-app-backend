const Controller = require('./Controller')
const { today } = require('../utils')
const { DaoTask, Models } = require('../database')
const { ErrorTaskNotEditable } = require('./../errors/Errors')

class ControllerTask extends Controller {
  constructor() {
    super()

    this._daoTask = new DaoTask(Models)
  }

  /**
   * Middleware to validade the relationship between the current
   * logged in user and the specified task on the URL params. 
   * If the task can not be found error code 404 will be returned.
   * If the task does not belong to the user, error code 403 will be returned
   * If the task belongs to the user, the task data will be saved on 
   * req.locals.task in other to be available for the incoming middlewares
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} req.params.taskId
   * @memberof ControllerTask
   */
  _validateTaskOwnership() {
    return async (req, res, next) => {
      const { userId } = req.locals
      const { taskId } = req.params

      try {
        let task = await this._daoTask.findByPkIncludeProject(taskId)

        // Task does not exists
        if (!task) {
          return res.sendStatus(404)
        }

        // Task does not belong to the authenticated user
        if (task.project.user_id !== userId) {
          return res.sendStatus(403)
        }

        // Removes Project Information
        const { project: _, ...taskData } = task.dataValues

        req.locals.task = taskData
        next()
      } catch (err) {
        next(err)
      }
    }
  }

  /**
   * Verifies if the task at `req.locals.task` is eligible for 
   * editing or deletion. Tasks marked as finished should not 
   * be edited or deleted.
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @return {*} 
   * @memberof ControllerTask
   */
  _isTaskEligibleForEdit() {
    return async (req, _, next) => {
      const { task } = req.locals

      try {

        if (task.finish_date) {
          throw new ErrorTaskNotEditable(req.path)
        }

        next()
      } catch (err) {
        next(err)
      }
    }
  }

  /**
   * Get Task by ID
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} req.params.taskId
   * @return {*} 
   * @memberof ControllerTask
   */
  getTaskById() {
    return [
      this._validateTaskOwnership(),
      async (req, res, next) => {
        try {
          res.send(req.locals.task)
        } catch (err) {
          next(err)
        }
      }
    ]
  }

  /**
   * Edits Task
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} req.params.taskId
   * @param {string} req.body.name
   * @param {string} req.body.description   
   * @param {string} req.body.termination_date
   * @return {*} 
   * @memberof ControllerTask
   */
  putTask() {
    return [
      this._validateTaskOwnership(),
      this._isTaskEligibleForEdit(),
      async (req, res, next) => {
        const { taskId } = req.params

        try {
          await this._daoTask.updateByPk(taskId, req.body)
          res.sendStatus(204)
        } catch (err) {
          next(err)
        }
      }
    ]
  }

  /**
   * Deletes Task
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} req.params.taskId
   * @return {*} 
   * @memberof ControllerTask
   */
  deleteTask() {
    return [
      this._validateTaskOwnership(),
      this._isTaskEligibleForEdit(),
      async (req, res, next) => {
        const { taskId } = req.params

        try {
          await this._daoTask.destroyByPk(taskId)
          res.sendStatus(204)
        } catch (err) {
          next(err)
        }
      }
    ]
  }

  /**
   * Middleware to set Task finish_date.
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {string} date
   * @param {number} req.params.taskId
   * @return {*} 
   * @memberof ControllerTask
   */
  _setTaskFinishDate(date) {
    return async (req, res, next) => {
      const { taskId } = req.params

      try {
        await this._daoTask.updateFinishDateByPk(taskId, date)
        res.sendStatus(204)
      } catch (err) {
        next(err)
      }
    }
  }

  /**
   * Middleware to set Task finish_date as today date.
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} req.params.taskId
   * @return {*} 
   * @memberof ControllerTask
   */
  setTaskAsFinished() {
    return [
      this._validateTaskOwnership(),
      this._setTaskFinishDate(today())
    ]
  }

  /**
   * Middleware to set Task finish_date as null.
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} req.params.taskId
   * @return {*} 
   * @memberof ControllerTask
   */
  setTaskAsUnFinished() {
    return [
      this._validateTaskOwnership(),
      this._setTaskFinishDate(null)
    ]
  }
}

module.exports = ControllerTask
