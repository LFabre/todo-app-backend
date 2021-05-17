const request = require('supertest')

const { MainApp } = require('../../../src/apps')
const { JWTManager } = require('../../../src/auth')
const { DUMMY_USER, DUMMY_SECRET } = require('./../../_helper/Dummy')
const { DaoUserAuth, Models } = require('../../../src/database')

const ROUTE = '/projects'
let TOKEN_U1, TOKEN_U2

beforeAll(async done => {
  let daoUserAuth = new DaoUserAuth(Models)
  await daoUserAuth.createIncludeUser({
    ...DUMMY_USER,
    secret: DUMMY_SECRET
  })

  await daoUserAuth.createIncludeUser({
    ...DUMMY_USER,
    login: 'SecondUser',
    secret: DUMMY_SECRET
  })

  TOKEN_U1 = await JWTManager.sign({ userId: 1 })
  TOKEN_U2 = await JWTManager.sign({ userId: 2 })

  done()
})

describe('Test Route Project', () => {

  describe('Permissions - Block Invalid Token', () => {
    it('Block - Get All Projects', async done => {
      return request(MainApp)
        .get(ROUTE)
        .set('Authorization', 'INVALID_TOKEN')
        .then(res => {
          expect(res.statusCode).toBe(401)
          done()
        })
    })

    it('Block - Get Project', async done => {
      return request(MainApp)
        .get(`${ROUTE}/1`)
        .set('Authorization', 'INVALID_TOKEN')
        .then(res => {
          expect(res.statusCode).toBe(401)
          done()
        })
    })

    it('Block - Post Projects', async done => {
      return request(MainApp)
        .post(ROUTE)
        .set('Authorization', 'INVALID_TOKEN')
        .then(res => {
          expect(res.statusCode).toBe(401)
          done()
        })
    })

    it('Block - Post Project Task', async done => {
      return request(MainApp)
        .post(`${ROUTE}/1/task`)
        .set('Authorization', 'INVALID_TOKEN')
        .then(res => {
          expect(res.statusCode).toBe(401)
          done()
        })
    })

    it('Block - Put Projects', async done => {
      return request(MainApp)
        .put(`${ROUTE}/1`)
        .set('Authorization', 'INVALID_TOKEN')
        .send({ name: 'New Name' })
        .then(res => {
          expect(res.statusCode).toBe(401)
          done()
        })
    })

    it('Block - Delete Projects', async done => {
      return request(MainApp)
        .delete(`${ROUTE}/1`)
        .set('Authorization', 'INVALID_TOKEN')
        .send({ name: 'New Name' })
        .then(res => {
          expect(res.statusCode).toBe(401)
          done()
        })
    })
  })

  test('Create Project', async done => {
    return request(MainApp)
      .post(ROUTE)
      .set('Authorization', TOKEN_U1)
      .send({
        name: 'First Project',
        description: 'Dummy Description',
      })
      .then(res => {
        expect(res.statusCode).toBe(200)
        expect(res.body.user_id).toBe(1)
        done()
      })
  })

  describe('Create Task', () => {
    test('Create Task', async done => {
      return request(MainApp)
        .post(`${ROUTE}/1/task`)
        .set('Authorization', TOKEN_U1)
        .send({
          name: 'First Task',
          description: 'First Project Task',
        })
        .then(res => {
          expect(res.statusCode).toBe(200)
          expect(res.body.project_id).toBe(1)
          done()
        })
    })

    test('Create Task (UnAuthorized) - User 02', async done => {
      return request(MainApp)
        .post(`${ROUTE}/1/task`)
        .set('Authorization', TOKEN_U2)
        .send({
          name: 'First Task',
          description: 'First Project Task',
        })
        .then(res => {
          expect(res.statusCode).toBe(403)
          done()
        })
    })

    test('Create Task (UnKnown) - User 02', async done => {
      return request(MainApp)
        .post(`${ROUTE}/12/task`)
        .set('Authorization', TOKEN_U2)
        .send({
          name: 'First Task',
          description: 'First Project Task',
          termination_date: '2025-05-05',
        })
        .then(res => {
          expect(res.statusCode).toBe(404)
          done()
        })
    })
  })

  describe('Get all Project Tasks', () => {
    test('Get Tasks', async done => {
      return request(MainApp)
        .get(`${ROUTE}/1/task`)
        .set('Authorization', TOKEN_U1)
        .then(res => {
          expect(res.statusCode).toBe(200)
          expect(res.body).toHaveLength(1)
          res.body.forEach(e => {
            expect(e.project_id).toBe(1)
          })
          done()
        })
    })
  })

  describe('Get All after New Project', () => {
    test('Get all projects - User 01', async done => {
      return request(MainApp)
        .get(ROUTE)
        .set('Authorization', TOKEN_U1)
        .then(res => {
          expect(res.statusCode).toBe(200)
          expect(res.body).toHaveLength(1)
          res.body.forEach(e => {
            expect(e.user_id).toBe(1)
            expect(e).toHaveProperty('tasks')
          })
          done()
        })
    })

    test('Get all projects - User 01 - Project Only', async done => {
      return request(MainApp)
        .get(`${ROUTE}?projectOnly=true`)
        .set('Authorization', TOKEN_U1)
        .then(res => {
          expect(res.statusCode).toBe(200)
          expect(res.body).toHaveLength(1)
          res.body.forEach(e => {
            expect(e.user_id).toBe(1)
            expect(e).not.toHaveProperty('tasks')
          })
          done()
        })
    })

    // Tests if the User can only see it's own projetcs
    test('Get all projects - User 02', async done => {
      return request(MainApp)
        .get(ROUTE)
        .set('Authorization', TOKEN_U2)
        .then(res => {
          expect(res.statusCode).toBe(200)
          expect(res.body).toHaveLength(0)
          done()
        })
    })
  })

  describe('Get Project by ID', () => {
    test('Get project - User 01', async done => {
      return request(MainApp)
        .get(`${ROUTE}/1`)
        .set('Authorization', TOKEN_U1)
        .then(res => {
          expect(res.statusCode).toBe(200)
          expect(res.body.project_id).toBe(1)
          expect(res.body.user_id).toBe(1)
          done()
        })
    })

    test('Get project - User 01 - Include Tasks', async done => {
      return request(MainApp)
        .get(`${ROUTE}/1?includeTasks=true`)
        .set('Authorization', TOKEN_U1)
        .then(res => {
          expect(res.statusCode).toBe(200)
          expect(res.body.project_id).toBe(1)
          expect(res.body.user_id).toBe(1)
          expect(res.body).toHaveProperty('tasks')
          done()
        })
    })

    it('Get project - User 02', async done => {
      return request(MainApp)
        .get(`${ROUTE}/1`)
        .set('Authorization', TOKEN_U2)
        .then(res => {
          expect(res.statusCode).toBe(403)
          done()
        })
    })

    it('Get Unknown project', async done => {
      return request(MainApp)
        .get(`${ROUTE}/545`)
        .set('Authorization', TOKEN_U1)
        .then(res => {
          expect(res.statusCode).toBe(404)
          done()
        })
    })
  })

  describe('Edit Project', () => {
    test('Edit project - User 01', async done => {
      return request(MainApp)
        .put(`${ROUTE}/1`)
        .set('Authorization', TOKEN_U1)
        .send({ name: 'New Project Name' })
        .then(res => {
          expect(res.statusCode).toBe(204)
          done()
        })
    })

    it('Edit project - User 02', async done => {
      return request(MainApp)
        .put(`${ROUTE}/1`)
        .set('Authorization', TOKEN_U2)
        .send({ name: 'New Project Name' })
        .then(res => {
          expect(res.statusCode).toBe(403)
          done()
        })
    })

    it('Get Unknown project', async done => {
      return request(MainApp)
        .put(`${ROUTE}/545`)
        .set('Authorization', TOKEN_U1)
        .send({ name: 'New Project Name' })
        .then(res => {
          expect(res.statusCode).toBe(404)
          done()
        })
    })
  })

  describe('Delete Project', () => {
    it('Delete project - User 02', async done => {
      return request(MainApp)
        .delete(`${ROUTE}/1`)
        .set('Authorization', TOKEN_U2)
        .then(res => {
          expect(res.statusCode).toBe(403)
          done()
        })
    })

    test('Delete project - User 01', async done => {
      return request(MainApp)
        .delete(`${ROUTE}/1`)
        .set('Authorization', TOKEN_U1)
        .then(res => {
          expect(res.statusCode).toBe(204)
          done()
        })
    })

    test('Get Task after project delete', async done => {
      return request(MainApp)
        .delete('/tasks/1')
        .set('Authorization', TOKEN_U1)
        .then(res => {
          expect(res.statusCode).toBe(404)
          done()
        })
    })

    it('Delete Unknown project', async done => {
      return request(MainApp)
        .delete(`${ROUTE}/545`)
        .set('Authorization', TOKEN_U1)
        .then(res => {
          expect(res.statusCode).toBe(404)
          done()
        })
    })
  })
})
