const Dao = require('./Dao')

/**
 * Grants access to ModelUser methods
 *
 * @author Lucas Fabre
 * @date 2021-05-15
 * @class DaoUser
 * @extends {Dao}
 */
class DaoUser extends Dao {
  constructor(Models) {
    super(Models, Models.User)    
  }

  /**
  * Finds an User by login
  *
  * @author Lucas Fabre
  * @date 2021-05-15
  * @param {strings} login
  * @param {object} [options={}]
  * @return {object} ModelUser
  * @memberof DaoUser
  */
  findOneByLogin(login, options = {}) {
    return this.findOneByProp('login', login, options)
  }

  /**
   * Creates an User entry
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {object} obj
   * @param {object} [options={}]
   * @return {object} ModelUser
   * @memberof DaoUser
   */
  create(obj, options = {}) {
    return super.create({
      login: obj.login,
      first_name: obj.first_name,
      last_name: obj.last_name,
    }, options)
  }

  /**
   * Updates user entry by primary key
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number} pk
   * @param {object} obj
   * @param {object} [options={}]
   * @return {number[]} 
   * @memberof DaoUser
   */
  updateByPk(pk, obj, options = {}) {
    return this.update({
      first_name: obj.first_name,
      last_name: obj.last_name,
    }, {
      ...options,
      where: { user_id: pk }
    })
  }
}

module.exports = DaoUser