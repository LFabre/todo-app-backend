const Controller = require('./Controller');
const { HashManager, JWTManager } = require('./../auth')
const { DaoUser, DaoUserAuth, Models } = require('./../database');
const {
  ErrorLoginAlreadyInUse, ErrorInvalidLoginCredentials,
  ErrorInvalidJWT
} = require('../errors/Errors');

// Cookie Key
const TOK = 'tok'

/**
 * Provides Authentication middlewares.
 *
 * @author Lucas Fabre
 * @date 2021-05-15
 * @class ControllerAuth
 * @extends {Controller}
 */
class ControllerAuth extends Controller {
  constructor() {
    super()

    this._daoUser = new DaoUser(Models)
    this._daoUserAuth = new DaoUserAuth(Models)
  }

  /**
   * Registers a new User
   *
   * @author Lucas Fabre
   * @date 2021-05-15   
   * @param {string} req.body.login
   * @param {string} req.body.password
   * @param {string} req.body.first_name
   * @param {string} req.body.last_name
   * @return {*} 
   * @memberof ControllerAuth
   */
  registerUser() {
    return async (req, res, next) => {
      try {
        // Check if Login is already in use
        let user = await this._daoUser.findOneByLogin(req.body.login)
        if (user) {
          throw new ErrorLoginAlreadyInUse(req.path)
        }

        let hash = await HashManager.hash(req.body.password)

        let userAuth = await this._daoUserAuth.createIncludeUser({
          secret: hash,
          ...req.body
        })

        res.send(userAuth.user.dataValues)
      } catch (err) {
        next(err)
      }
    }
  }

  /**
   * Validates user credentials. If they are correct, 
   * retrieves user information send them on a JWT on 
   * response body and set cookie Header.
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @param {string} req.body.login
   * @param {string} req.body.password
   * @return {*} 
   * @memberof ControllerAuth
   */
  login() {
    return async (req, res, next) => {
      const { login, password } = req.body

      try {
        let userAuth = await this._daoUserAuth.findOneByUserLogin(login)

        if (!userAuth || !await HashManager.compare(password, userAuth.secret)) {
          throw new ErrorInvalidLoginCredentials(req.path)
        }

        let token = await JWTManager.sign({
          login,
          userId: userAuth.user.user_id,
          user: userAuth.user.dataValues
        })

        res.cookie(TOK, token, { HttpOnly: true })
        res.send({ token, user: userAuth.user.dataValues })
      } catch (err) {
        next(err)
      }
    }
  }

  /**
   * Authenticates a JWT send on Authorization header or
   * Authentication Cookie.
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @return {*}
   * @memberof ControllerAuth
   */
  authenticate() {
    return async (req, _, next) => {
      try {

        let jwt = req.get('Authorization') || req.cookies[TOK]

        const decoded = await JWTManager.verify(jwt).catch(jwtErr => {
          throw new ErrorInvalidJWT(jwtErr, req.path)
        })

        req.isAuthenticated = () => true
        req.locals = {
          userId: decoded.data.userId,
        }

        next()
      } catch (err) {
        next(err)
      }
    }
  }

  /**
   * Renew a JWT send on Authorization header or
   * Authentication Cookie.
   *
   * @author Lucas Fabre
   * @date 2021-05-15
   * @return {*} 
   * @memberof ControllerAuth
   */
  reconnect() {
    return async (req, res, next) => {
      try {

        let jwt = req.get('Authorization') || req.cookies[TOK]

        const decoded = await JWTManager.verify(jwt)
          .catch(jwtErr => { throw new ErrorInvalidJWT(jwtErr, req.path) })

        let token = await JWTManager.sign(decoded.data)

        res.cookie(TOK, token, { HttpOnly: true })
        res.send({ token, user: decoded.data.user })
      } catch (err) {
        next(err)
      }
    }
  }

  /**
 * Middleware to validates if user is Authenticated.
 *
 * @author Lucas Fabre
 * @date 2021-05-15
 * @return {*} 
 * @memberof ControllerAuth
 */
  allowIfAuthenticated() {
    return async (req, res, next) => {
      return req.isAuthenticated() ? next() : res.sendStatus(403)
    }
  }
}

module.exports = ControllerAuth