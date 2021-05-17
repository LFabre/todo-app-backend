const JWT = require('jsonwebtoken');

const { AUTH_JWT_SECRET, AUTH_JWT_EXP_MIN } = process.env

/**
 * Handles JWT methods
 *
 * @author Lucas Fabre
 * @date 2021-05-15
 * @class JWTManager
 */
class JWTManager {

  /**
   * Creates JWT data payload with Expiration option
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @static
   * @param {object} data
   * @return {*} 
   * @memberof JWTManager
   */
  static _createPayload(data) {
    return {
      data,
      exp: Math.floor(Date.now() / 1000) + (60 * (AUTH_JWT_EXP_MIN || 60))
    }
  }

  /**
   * Signs JWT data
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @static
   * @param {object} data JWT Payload
   * @return {string} token
   * @memberof JWTManager
   */
  static sign(data) {
    return new Promise((resolve, reject) => {
      JWT.sign(JWTManager._createPayload(data), AUTH_JWT_SECRET, (err, token) => {
        err ? reject(err) : resolve(token)
      })
    })
  }

  /**
   * Verify JWT authenticity
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @static
   * @param {string} jwt
   * @return {object} decoded data
   * @memberof JWTManager
   */
  static verify(jwt) {
    return new Promise((resolve, reject) => {
      JWT.verify(jwt, AUTH_JWT_SECRET, (err, decoded) => {
        err ? reject(err) : resolve(decoded)
      })
    })
  }
}

module.exports = JWTManager