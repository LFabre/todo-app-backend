const {
  LOGIN_ALREADY_IN_USE, INVALID_LOGIN_CREDENTIALS,
  TOKEN_EXPIRED, TOKEN_INVALID, TASK_NOT_ELIGIBLE_FOR_EDITING
} = require('./ErrorCode')

/**
 * Base Error class.
 *
 * @author Lucas Fabre
 * @date 2021-05-15
 * @class ErrorCustom
 * @extends {Error}
 */
class ErrorCustom extends Error {
  constructor(code, status, msg, desc, path) {
    Error.stackTraceLimit = 4
    super(msg)

    this.code = code
    this.status = status
    this.msg = msg
    this.desc = desc
    this.path = path
    this.timestamp = new Date().toUTCString()
  }

  sendError(res) {
    res.status(this.status).send(this.toJson())
  }

  toString() {
    return JSON.stringify(this.toJson())
  }

  toJson() {
    return {
      path: this.path,
      code: this.code,
      status: this.status,
      message: this.message,
      timestamp: this.timestamp,
      description: this.desc,
    }
  }
}

/**
 * Error Login already in use.
 *
 * @author Lucas Fabre
 * @date 2021-05-15
 * @class ErrorLoginAlreadyInUse
 * @extends {ErrorCustom}
 */
class ErrorLoginAlreadyInUse extends ErrorCustom {
  constructor(path) {
    super(
      LOGIN_ALREADY_IN_USE,
      400,
      'Login is already in use.',
      'This Login already being used by another user.',
      path
    )
  }
}

/**
 * Error invalid login credentials
 *
 * @author Lucas Fabre
 * @date 2021-05-15
 * @class ErrorInvalidLoginCredentials
 * @extends {ErrorCustom}
 */
class ErrorInvalidLoginCredentials extends ErrorCustom {
  constructor(path) {
    super(
      INVALID_LOGIN_CREDENTIALS,
      400,
      'Invalid login credentials',
      'Invalid login credentials',
      path
    )
  }
}

/**
 * Error class to parse JWT errors.
 *
 * @author Lucas Fabre
 * @date 2021-05-15
 * @class ErrorInvalidJWT
 * @extends {ErrorCustom}
 */
class ErrorInvalidJWT extends ErrorCustom {
  // JWT Error: TokenExpiredError, JsonWebTokenError  
  constructor(jwtError, path) {
    if (jwtError.name === 'TokenExpiredError')
      super(
        TOKEN_EXPIRED,
        401,
        'Token has expired.',
        'Your token has expired. Please login again.',
        path
      )
    else
      super(
        TOKEN_INVALID,
        401,
        'Invalid token was provided.',
        '',
        path
      )
  }
}

class ErrorTaskNotEditable extends ErrorCustom {
  constructor(path) {
    super(
      TASK_NOT_ELIGIBLE_FOR_EDITING,
      409,
      'Task is not elegible for edition or deletion.',
      'Tasks marked as finished should not be edited or deleted.',
      path
    )
  }
}

module.exports = {
  ErrorCustom, ErrorLoginAlreadyInUse, ErrorInvalidLoginCredentials,
  ErrorInvalidJWT, ErrorTaskNotEditable
}