const Dao = require('./Dao')

/**
 * Grants access to ModelUserAuth methods
 *
 * @author Lucas Fabre
 * @date 2021-05-15
 * @class DaoUser
 * @extends {Dao}
 */
class DaoUserAuth extends Dao {
  constructor(Models) {
    super(Models, Models.UserAuth)

    this._includeUser = {
      model: this.Models.User,
      as: 'user'
    }
  }

  /**
 * Finds an UserAuth entry by userId
 *
 * @author Lucas Fabre
 * @date 2021-05-15
 * @param {number} userId
 * @return {*} 
 * @memberof DaoUserAuth
 */
  findOneByUserId(userId) {
    return this.findOneByProp('user_id', userId)
  }

  /**
   * Finds an UserAuth entry by User Login
   * Includes User
   * 
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {string} login
   * @return {object} ModelUserAuth
   * @memberof DaoUserAuth
   */
  findOneByUserLogin(login) {
    return this.findOne({
      include: [{
        ...this._includeUser,
        where: [{ login }]
      }]
    })
  }

  /**
   * Creates an UserAuth entry.
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {string} obj.secret
   * @param {number} obj.user_id
   * @param {object} [options={}]
   * @return {object} ModelUserAuth
   * @memberof DaoUserAuth
   */
  create(obj, options = {}) {
    return super.create({
      secret: obj.secret,
      user_id: obj.user_id,
    }, options)
  }

  /**
   * Creates an UserAuth and a related User entry.
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {string} obj.secret
   * @param {string} obj.login
   * @param {string} obj.first_name
   * @param {string} obj.last_name
   * @param {object} [options={}]
   * @return {object} UserAuth
   * @memberof DaoUserAuth
   */
  createIncludeUser(obj, options = {}) {
    return super.create({
      secret: obj.secret,

      user: {
        login: obj.login,
        first_name: obj.first_name,
        last_name: obj.last_name,
      }
    }, {
      ...options,
      include: [this._includeUser]
    })
  }
}

module.exports = DaoUserAuth
