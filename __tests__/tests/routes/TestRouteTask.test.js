const request = require('supertest')

const { today } = require('../../../src/utils')
const { MainApp } = require('../../../src/apps')
const { JWTManager } = require('../../../src/auth')
const { DUMMY_USER, DUMMY_SECRET } = require('./../../_helper/Dummy')
const { 
  TASK_NOT_ELIGIBLE_FOR_EDITING
 } = require('./../../../src/errors/ErrorCode')
const {
  DaoUserAuth, Models, DaoProject, DaoTask
} = require('../../../src/database')

const ROUTE = '/tasks'
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

  await (new DaoProject(Models)).create({
    user_id: 1, name: 'First Project'
  })

  await (new DaoTask(Models)).create({
    project_id: 1, name: 'First Project'
  })

  TOKEN_U1 = await JWTManager.sign({ userId: 1 })
  TOKEN_U2 = await JWTManager.sign({ userId: 2 })

  done()
})

describe('Test Route Task', () => {

  describe('Permissions - Block Invalid Token', () => {
    it('Block - Get Task by ID', async done => {
      return request(MainApp)
        .get(ROUTE)
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
        .send({ name: 'New Task 2' })
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

  describe('Get Task by ID', () => {
    test('Get Task - User 01', async done => {
      return request(MainApp)
        .get(`${ROUTE}/1`)
        .set('Authorization', TOKEN_U1)
        .then(res => {
          expect(res.statusCode).toBe(200)
          expect(res.body.task_id).toBe(1)
          done()
        })
    })

    it('Get Task - User 02', async done => {
      return request(MainApp)
        .get(`${ROUTE}/1`)
        .set('Authorization', TOKEN_U2)
        .then(res => {
          expect(res.statusCode).toBe(403)
          done()
        })
    })

    it('Get Unknown Task', async done => {
      return request(MainApp)
        .get(`${ROUTE}/545`)
        .set('Authorization', TOKEN_U1)
        .then(res => {
          expect(res.statusCode).toBe(404)
          done()
        })
    })
  })

  describe('Edit Task by ID', () => {
    test('Edit Task - User 01', async done => {
      return request(MainApp)
        .put(`${ROUTE}/1`)
        .set('Authorization', TOKEN_U1)
        .send({
          name: 'New Task Name',
          termination_date: '2020-12-12'
        })
        .then(res => {
          expect(res.statusCode).toBe(204)
          done()
        })
    })

    it('Edit Task - User 02', async done => {
      return request(MainApp)
        .put(`${ROUTE}/1`)
        .set('Authorization', TOKEN_U2)
        .send({ name: 'New Task Name' })
        .then(res => {
          expect(res.statusCode).toBe(403)
          done()
        })
    })

    it('Edit Unknown Task', async done => {
      return request(MainApp)
        .put(`${ROUTE}/545`)
        .set('Authorization', TOKEN_U1)
        .send({ name: 'New Task Name' })
        .then(res => {
          expect(res.statusCode).toBe(404)
          done()
        })
    })
  })

  describe('Set Finish Date', () => {
    test('Set Finished', async done => {
      return request(MainApp)
        .put(`${ROUTE}/1/set/finished`)
        .set('Authorization', TOKEN_U1)
        .then(res => {
          expect(res.statusCode).toBe(204)
          done()
        })
    })

    test('Get Task After Finished', async done => {
      return request(MainApp)
        .get(`${ROUTE}/1`)
        .set('Authorization', TOKEN_U1)
        .then(res => {
          expect(res.statusCode).toBe(200)
          expect(res.body.task_id).toBe(1)
          expect(res.body.finish_date).toBe(today())
          done()
        })
    })

    it('Edit Task After Marked as Finished', async done => {
      return request(MainApp)
        .put(`${ROUTE}/1`)
        .set('Authorization', TOKEN_U1)
        .send({ name: 'New Task Name' })
        .then(res => {
          expect(res.statusCode).toBe(409)
          expect(res.body.code).toBe(TASK_NOT_ELIGIBLE_FOR_EDITING)
          done()
        })
    })

    it('Delete Task After Marked as Finished', async done => {
      return request(MainApp)
        .delete(`${ROUTE}/1`)
        .set('Authorization', TOKEN_U1)        
        .then(res => {
          expect(res.statusCode).toBe(409)
          expect(res.body.code).toBe(TASK_NOT_ELIGIBLE_FOR_EDITING)
          done()
        })
    })

    test('Set UnFinished', async done => {
      return request(MainApp)
        .put(`${ROUTE}/1/set/unfinished`)
        .set('Authorization', TOKEN_U1)
        .then(res => {
          expect(res.statusCode).toBe(204)
          done()
        })
    })

    test('Get Task After UnFinished', async done => {
      return request(MainApp)
        .get(`${ROUTE}/1`)
        .set('Authorization', TOKEN_U1)
        .then(res => {
          expect(res.statusCode).toBe(200)
          expect(res.body.task_id).toBe(1)
          expect(res.body.finish_date).toBe(null)
          done()
        })
    })
  })

  describe('Delete Task by ID', () => {
    it('Delete Task - User 02', async done => {
      return request(MainApp)
        .delete(`${ROUTE}/1`)
        .set('Authorization', TOKEN_U2)
        .then(res => {
          expect(res.statusCode).toBe(403)
          done()
        })
    })

    test('Delete Task - User 01', async done => {
      return request(MainApp)
        .delete(`${ROUTE}/1`)
        .set('Authorization', TOKEN_U1)
        .then(res => {
          expect(res.statusCode).toBe(204)
          done()
        })
    })

    it('Delete Unknown Task', async done => {
      return request(MainApp)
        .delete(`${ROUTE}/545`)
        .set('Authorization', TOKEN_U1)
        .then(res => {
          expect(res.statusCode).toBe(404)
          done()
        })
    })

    it('Get Task after Delete', async done => {
      return request(MainApp)
        .get(`${ROUTE}/1`)
        .set('Authorization', TOKEN_U1)
        .then(res => {
          expect(res.statusCode).toBe(404)
          done()
        })
    })
  })
})
