const request = require('supertest')

const { MainApp } = require('../../../src/apps')
const { DUMMY_USER } = require('./../../_helper/Dummy')
const { LOGIN_ALREADY_IN_USE } = require('./../../../src/errors/ErrorCode')

const ROUTE = '/auth'
let TOKEN

describe('Test Route Auth', () => {

  describe('Register User', () => {

    it('Register User - Without Login', async done => {
      return request(MainApp)
        .post(`${ROUTE}/register`)
        .send({
          first_name: 'Name',
          last_name: 'Last Name',
          password: '1234'
        })
        .then(res => {
          expect(res.statusCode).toEqual(400)
          done()
        })
    })

    it('Register User - Without Password', async done => {
      return request(MainApp)
        .post(`${ROUTE}/register`)
        .send({
          login: 'User01',
          first_name: 'Name',
          last_name: 'Last Name',
        })
        .then(res => {
          expect(res.statusCode).toEqual(400)
          done()
        })
    })

    test('Register User', async done => {
      return request(MainApp)
        .post(`${ROUTE}/register`)
        .send(DUMMY_USER)
        .then(res => {
          expect(res.statusCode).toEqual(200)
          expect(res.body).toBeDefined()
          done()
        })
    })

    it('Register User - Login already in use', async done => {
      return request(MainApp)
        .post(`${ROUTE}/register`)
        .send(DUMMY_USER)
        .then(res => {
          expect(res.statusCode).toEqual(400)
          expect(res.body.code).toBe(LOGIN_ALREADY_IN_USE)
          done()
        })
    })
  })

  describe('Login', () => {
    it('Login - Undefined Password', async done => {
      return request(MainApp)
        .post(`${ROUTE}/login`)
        .send({
          login: DUMMY_USER.login,
          password: undefined
        })
        .then(res => {
          expect(res.statusCode).toEqual(400)
          done()
        })
    })

    it('Login - Undefined Login', async done => {
      return request(MainApp)
        .post(`${ROUTE}/login`)
        .send({
          login: undefined,
          password: DUMMY_USER.password
        })
        .then(res => {
          expect(res.statusCode).toEqual(400)
          done()
        })
    })

    it('Login - Wrong Login', async done => {
      return request(MainApp)
        .post(`${ROUTE}/login`)
        .send({
          login: 'wrong',
          password: DUMMY_USER.password
        })
        .then(res => {
          expect(res.statusCode).toEqual(400)
          done()
        })
    })

    it('Login - Wrong Password', async done => {
      return request(MainApp)
        .post(`${ROUTE}/login`)
        .send({
          login: DUMMY_USER.login,
          password: 'wrong'
        })
        .then(res => {
          expect(res.statusCode).toEqual(400)
          done()
        })
    })

    test('Login', async done => {
      return request(MainApp)
        .post(`${ROUTE}/login`)
        .send({
          login: DUMMY_USER.login,
          password: DUMMY_USER.password
        })
        .then(res => {
          expect(res.statusCode).toEqual(200)
          expect(res.body).toHaveProperty('token')
          expect(res.body).toHaveProperty('user')

          TOKEN = res.body.token
          done()
        })
    })
  })

  describe('Reconnect', () => {
    test('Reconnect', async done => {
      return request(MainApp)
        .post(`${ROUTE}/reconnect`)
        .set('Authorization', TOKEN)
        .then(res => {
          expect(res.statusCode).toEqual(200)
          expect(res.body).toHaveProperty('token')
          expect(res.body).toHaveProperty('user')
          done()
        })
    })

    it('Reconnect - Undefined Token', async done => {
      return request(MainApp)
        .post(`${ROUTE}/reconnect`)
        .then(res => {
          expect(res.statusCode).toEqual(401)
          done()
        })
    })
  })
})
