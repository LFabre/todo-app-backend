const { DUMMY_USER } = require('../../_helper/Dummy')
const {
  Models, DaoUser
} = require('./../../../src/database')

const daoUser = new DaoUser(Models)

describe('Test Dao User', () => {
  test('Create', () => {
    return daoUser.create(DUMMY_USER)
      .then(r => {
        expect(r).toBeDefined()
        expect(r.login).toBe(DUMMY_USER.login)
      })
  })

  test('Update by Primary Key', () => {
    return daoUser.updateByPk(1, { fist_name: 'New Name' })
      .then(r => {
        expect(r).toBeDefined()
        expect(r).toHaveLength(1)
      })
  })

  test('Find by Login', () => {
    return daoUser.findOneByLogin(DUMMY_USER.login)
      .then(r => {
        expect(r).toBeDefined()
        expect(r.login).toBe(DUMMY_USER.login)
      })
  })
})