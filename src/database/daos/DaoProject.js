const Dao = require("./Dao");

class DaoProject extends Dao {
  constructor(Models) {
    super(Models, Models.Project)

    this._includeTasks = {
      model: Models.Task,
      as: 'tasks'
    }
  }

  /**
   * Finds all projects by User ID
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} userId
   * @param {object} [options={}]
   * @return {object[]} ModelProject Array
   * @memberof DaoProject
   */
  findAllByUserId(userId, options = {}) {
    return this.findAllByProp('user_id', userId, options)
  }

  /**
   * Finds a Project by primary Key
   * Includes Tasks information.
   *
   * @author Lucas Fabre
   * @date 2021-05-16
   * @param {number} pk
   * @param {object} [options={}]
   * @return {*} 
   * @memberof DaoProject
   */
  findByPkIncludeTasks(pk, options = {}) {
    return this.findByPk(pk, {
      ...options,
      include: [this._includeTasks]
    })
  }

  /**
   * Finds all projects by User ID.
   * Include Project Tasks
   * 
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} userId
   * @param {object} [options={}]
   * @return {object[]} ModelProject Array
   * @memberof DaoProject
   */
  findAllByUserIdIncludeTasks(userId, options = {}) {
    return this.findAllByUserId(userId, {
      ...options,
      include: [this._includeTasks]
    })
  }

  /**
   * Creates Project entry
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {string} obj.name
   * @param {number} obj.user_id
   * @param {string} obj.description
   * @param {object} [options={}]
   * @return {object} ModelProject
   * @memberof DaoProject
   */
  create(obj, options = {}) {
    return super.create({
      name: obj.name,
      user_id: obj.user_id,
      description: obj.description,
    }, options)
  }

  /**
   * Updates project by primary key
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} pk
   * @param {string} obj.name
   * @param {string} obj.description
   * @param {object} [options={}]
   * @return {number[]} 
   * @memberof DaoProject
   */
  updateByPk(pk, obj, options = {}) {
    return this.update({
      name: obj.name,
      description: obj.description,
    }, {
      ...options,
      where: { project_id: pk }
    })
  }

  /**
   * Destroys a project by Primary Key
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} pk
   * @param {options} options
   * @memberof DaoProject
   */
  destroyByPk(pk, options = {}) {
    return this.destroy({
      where: { project_id: pk },
      ...options
    })
  }
}

module.exports = DaoProject