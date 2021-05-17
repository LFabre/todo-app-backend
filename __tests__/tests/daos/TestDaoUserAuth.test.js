const { DUMMY_USER } = require('../../_helper/Dummy')
const {
  Models, DaoUserAuth
} = require('./../../../src/database')

const daoUserAuth = new DaoUserAuth(Models)

describe('Test Dao User', () => {
  test('Create Include User', () => {
    return daoUserAuth.createIncludeUser({
      secret: 'secret',
      ...DUMMY_USER
    })
      .then(r => {
        expect(r).toBeDefined()
        expect(r).toHaveProperty('user')
      })
  })

  test('Find one By User Id', () => {
    return daoUserAuth.findOneByUserId(1)
      .then(r => {
        expect(r).toBeDefined()
        expect(r.user_id).toBe(1)
      })
  })

  test('Find one By User Login', () => {
    return daoUserAuth.findOneByUserLogin(DUMMY_USER.login)
      .then(r => {
        expect(r).toBeDefined()
        expect(r).toHaveProperty('user')
        expect(r.user.login).toBe(DUMMY_USER.login)
      })
  })
})