const { DUMMY_USER } = require('../../_helper/Dummy')
const {
  Models, DaoUser, DaoProject
} = require('./../../../src/database')

const daoProject = new DaoProject(Models)

beforeAll(async done => {
  await (new DaoUser(Models)).create(DUMMY_USER)
  done()
})

describe('Test Dao Project', () => {
  test('Create', () => {
    return daoProject.create({
      user_id: 1,
      name: 'Project 01',
      description: 'My First Project',
    })
      .then(r => {
        expect(r).toBeDefined()
      })
  })

  test('Find All by user ID', () => {
    return daoProject.findAllByUserId(1)
      .then(r => {
        expect(r).toBeDefined()
        expect(r).toHaveLength(1)
        r.forEach(e => expect(e.user_id).toBe(1))
      })
  })

  test('Find All by user ID - Include Tasks', () => {
    return daoProject.findAllByUserIdIncludeTasks(1)
      .then(r => {
        expect(r).toBeDefined()
        expect(r).toHaveLength(1)
        r.forEach(e => {
          expect(e.user_id).toBe(1)
          expect(e).toHaveProperty('tasks')
        })
      })
  })

  test('Find by Primary Key', () => {
    return daoProject.findByPk(1)
      .then(r => {
        expect(r).toBeDefined()
        expect(r.project_id).toBe(1)
      })
  })

  test('Find by Primary Key - Include Tasks', () => {
    return daoProject.findByPkIncludeTasks(1)
      .then(r => {
        expect(r).toBeDefined()
        expect(r.project_id).toBe(1)
        expect(r).toHaveProperty('tasks')        
      })
  })

  test('Update Project Primary Key', () => {
    return daoProject.updateByPk(1, { name: 'New Name' })
      .then(r => {
        expect(r).toBeDefined()
        expect(r).toHaveLength(1)
      })
  })

  test('Destroy by Primary Key', () => {
    return daoProject.destroyByPk(1)
      .then(r => {
        expect(r).toBeDefined()
        expect(r).toBe(1)
      })
  })

  test('Find All by user ID - After Deletion', () => {
    return daoProject.findAllByUserId(1)
      .then(r => {
        expect(r).toBeDefined()
        expect(r).toHaveLength(0)
      })
  })
})