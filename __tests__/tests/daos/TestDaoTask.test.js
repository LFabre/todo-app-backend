const { DUMMY_USER } = require('../../_helper/Dummy')
const {
  Models, DaoUser, DaoProject, DaoTask
} = require('./../../../src/database')

const daoTask = new DaoTask(Models)

beforeAll(async done => {
  await (new DaoUser(Models)).create(DUMMY_USER)
  await (new DaoProject(Models)).create({
    user_id: 1, name: 'Project'
  })
  done()
})

describe('Test Dao Task', () => {
  test('Create', () => {
    return daoTask.create({
      project_id: 1,
      name: 'Task 01',
      description: 'Task 01',
    })
      .then(r => {
        expect(r).toBeDefined()
      })
  })

  test('Find All by Project ID', () => {
    return daoTask.findAllByProjectId(1)
      .then(r => {
        expect(r).toBeDefined()
        expect(r).toHaveLength(1)
        r.forEach(e => expect(e.project_id).toBe(1))
      })
  })

  test('Find by Primary Key', () => {
    return daoTask.findByPk(1)
      .then(r => {
        expect(r).toBeDefined()
        expect(r.task_id).toBe(1)
      })
  })

  test('Find by Primary Key - Include Project', () => {
    return daoTask.findByPkIncludeProject(1)
      .then(r => {
        expect(r).toBeDefined()
        expect(r.task_id).toBe(1)
        expect(r).toHaveProperty('project')
        expect(r.project).toHaveProperty('user_id')
      })
  })

  test('Update Task by Primary Key', () => {
    return daoTask.updateByPk(1, { name: 'New Task 2.0' })
      .then(r => {
        expect(r).toBeDefined()
        expect(r).toHaveLength(1)
      })
  })

  test('Update Finish Date by Primary Key', () => {
    return daoTask.updateByPk(1, '2020-10-10')
      .then(r => {
        expect(r).toBeDefined()
        expect(r).toHaveLength(1)
      })
  })

  test('Destroy by Primary Key', () => {
    return daoTask.destroyByPk(1)
      .then(r => {
        expect(r).toBeDefined()
        expect(r).toBe(1)
      })
  })

  test('Find All by Project ID - After Deletion', () => {
    return daoTask.findAllByProjectId(1)
      .then(r => {
        expect(r).toBeDefined()
        expect(r).toHaveLength(0)
      })
  })

  test('Restore Taks', () => {
    return daoTask.restoreByPk(1)
      .then(r => {
        expect(r).toBeDefined()
        expect(r).toBe(1)
      })
  })

  test('Find All by Project ID - After Restore', () => {
    return daoTask.findAllByProjectId(1)
      .then(r => {
        expect(r).toBeDefined()
        expect(r).toHaveLength(1)
      })
  })

  test('Destroy by Project Id', () => {
    return daoTask.destroyByProjectId(1)
      .then(r => {
        expect(r).toBeDefined()
        expect(r).toBe(1)
      })
  })

  test('Find All by Project ID - After Deletion', () => {
    return daoTask.findAllByProjectId(1)
      .then(r => {
        expect(r).toBeDefined()
        expect(r).toHaveLength(0)
      })
  })
})