/**
 * Provides basic methods for any Sequelize Model
 *
 * @author Lucas Fabre
 * @date 2021-05-15
 * @class Dao
 */
class Dao {

  /**
   * Creates an instance of Dao.
   * 
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {object} Models - All Sequelize Models Object
   * @param {object} model - Sequelize Model
   * @memberof Dao
   */
  constructor(Models, model) {
    this.model = model
    this.Models = Models
    this.sequelize = Models.sequelize
  }

  /**
   * Returns a entry matched with the provided primary key
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {number|string} pk
   * @param {object} [options={}]
   * @return {object} 
   * @memberof Dao
   */
  findByPk(pk, options = {}) {
    return this.model.findByPk(pk, options)
  }

  /**
   * Returns first entry matched with the options provided
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {object} [options={}]
   * @return {object} 
   * @memberof Dao
   */
  findOne(options = {}) {
    return this.model.findOne(options)
  }

  /**
  * Returns first entry matched with the property provided
  *
   * @author Lucas Fabre
   * @date 2021-05-15 
  * @param {string} prop
  * @param {number|string} val
  * @param {object} [options={}]
  * @return {object} 
  * @memberof Dao
  */
  findOneByProp(prop, val, options = {}) {
    return this.model.findOne({ ...options, where: { [prop]: val } })
  }

  /**
   * Returns all entries matched with the options provided
   *
     * @author Lucas Fabre
     * @date 2021-05-15
   * @param {object} [options={}]
   * @return {object} 
   * @memberof Dao
   */
  findAll(options = {}) {
    return this.model.findAll(options)
  }

  /**
   * Returns all entries matched with the property provided
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {string} prop
   * @param {number|string} val
   * @param {object} [options={}]
   * @return {object} 
   * @memberof Dao
   */
  findAllByProp(prop, val, options = {}) {
    return this.model.findAll({
      ...options,
      where: { [prop]: val, ...options.where },
    })
  }

  /**
   * Creates an entry for the class Model
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {object} obj
   * @param {object} [option={}]
   * @return {object} 
   * @memberof Dao
   */
  create(obj, option = {}) {
    return this.model.create(obj, option)
  }

  /**
   * Creates multiple entries for the claass Model
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {object[]} objs
   * @param {object} [option={}]
   * @return {object[]} 
   * @memberof Dao
   */
  bulkCreate(objs, option = {}) {
    return this.model.bulkCreate(objs, option)
  }

  /**
   * Updates an entry
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {object} obj
   * @param {object} [options={}]
   * @return {number[]} 
   * @memberof Dao
   */
  update(obj, options = {}) {
    return this.model.update(obj, options)
  }

  /**
   * Updates specific property of an entry
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {string} prop
   * @param {number|string} val
   * @param {object} [options={}]
   * @return {number[]} 
   * @memberof Dao
   */
  setProp(prop, val, options = {}) {
    return this.model.update({ [prop]: val }, options)
  }

  /**
   * Destroy class Model entries.
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {object} [options]
   * @memberof Dao
   */
  destroy(options) {
    return this.model.destroy(options)
  }

  /**
   * Restores entries from class Model
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {object} options
   * @return {number[]} 
   * @memberof Dao
   */
  restore(options) {
    return this.model.restore(options)
  }

  /**
   * Starts Database Transaction
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @return {object} 
   * @memberof Dao
   */
  startTransaction() {
    return this.model.sequelize.transaction()
  }

  /**
   * Returns Current Date string (YYYY-MM-DD)
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @author Lucas Fabre
   * @date 2021-05-15
   * @return {*} 
   * @memberof Dao
   */
  _seqFuncToday() {
    return this.model.sequelize.literal('CURRENT_DATE')
  }
}

module.exports = Dao