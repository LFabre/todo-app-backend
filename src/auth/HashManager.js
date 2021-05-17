const bcryptjs = require('bcryptjs')

/**
 * Provides methods for creating and validating hash
 *
 * @author Lucas Fabre
 * @date 2021-05-15
 * @class HashManager
 */
class HashManager {

  /**
   * Creates a new Hash. 
   * Salt is automatically generated.
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {string} secretToHash
   * @param {number} [salt=10]
   * @return {string} hash
   * @memberof HashManager
   */
  static hash(secretToHash, salt = 10) {
    return new Promise((resolve, reject) => {
      bcryptjs.hash(secretToHash, salt, (err, secret) => {
        err ? reject(err) : resolve(secret)
      })
    })
  }

  /**
   * Compares string with a hash
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @static
   * @param {*} psw
   * @param {*} secret
   * @return {*} 
   * @memberof HashManager
   */
  static compare(psw, secret) {
    return new Promise((resolve, reject) => {
      bcryptjs.compare(psw, secret, (err, result) => {        
        err ? reject(err) : resolve(result)
      })
    })
  }
}

module.exports = HashManager