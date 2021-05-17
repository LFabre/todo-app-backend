const Dao = require("./Dao");

class DaoTask extends Dao {
  constructor(Models) {
    super(Models, Models.Task)

    this._includeProject = {
      model: Models.Project,
      as: 'project'
    }
  }

  /**
   * Finds all Tasks by Project ID
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} projectId
   * @param {object} [options={}]
   * @return {object[]} ModelTask Array
   * @memberof DaoTask
   */
  findAllByProjectId(projectId, options = {}) {
    return this.findAllByProp('project_id', projectId, options)
  }

  /**
   * Finds a Task by Primary key.
   * Includes Project Data.
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} pk
   * @param {optons} options
   * @return {object} ModelTask
   * @memberof DaoTask
   */
  findByPkIncludeProject(pk, options) {
    return this.findByPk(pk, {
      include: [this._includeProject],
      ...options
    })
  }

  /**
   * Creates Task entry
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {string} obj.project_id
   * @param {string} obj.name
   * @param {string} obj.description   
   * @param {string} obj.termination_date
   * @param {object} [options={}]
   * @return {object} ModelTask
   * @memberof DaoTask
   */
  create(obj, options = {}) {    
    return super.create({
      project_id: obj.project_id,
      name: obj.name,
      description: obj.description,      
      termination_date: obj.termination_date,
    }, options)
  }

  /**
   * Updates Task by primary key
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} pk
   * @param {string} obj.name
   * @param {string} obj.description   
   * @param {string} obj.termination_date
   * @param {object} [options={}]
   * @return {number[]} 
   * @memberof DaoTask
   */
  updateByPk(pk, obj, options = {}) {
    return this.update({
      name: obj.name,
      description: obj.description,
      termination_date: obj.termination_date,
    }, {
      ...options,
      where: { task_id: pk }
    })
  }

  /**
   * Uptades Task finish_date
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} pk
   * @param {string} date
   * @param {object} [options={}]
   * @return {number[]} 
   * @memberof DaoTask
   */
  updateFinishDateByPk(pk, date, options = {}) {
    return this.update({
      finish_date: date,
    }, {
      ...options,
      where: { task_id: pk }
    })
  }

  /**
   * Destroys a task by Primary Key
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} pk
   * @param {options} options
   * @memberof DaoTask
   */
  destroyByPk(pk, options = {}) {
    return this.destroy({
      where: { task_id: pk },
      ...options
    })
  }

  /**
 * Destroys all Tasks from a Project.
 *
 * @author Lucas Fabre
 * @date 2021-05-15
 * @param {number} projectId
 * @param {options} options
 * @memberof DaoTask
 */
  destroyByProjectId(projectId, options = {}) {
    return this.destroy({
      where: { project_id: projectId },
      ...options
    })
  }

  /**
   * Restores Deleted Task.
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {object} options
   * @return {number[]} 
   * @memberof DaoTask
   */
  restoreByPk(pk, options = {}) {
    return this.restore({
      where: { task_id: pk },
      ...options
    })
  }
}

module.exports = DaoTask