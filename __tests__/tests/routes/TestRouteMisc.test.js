const request = require('supertest')
const { MainApp } = require('../../../src/apps')

describe('Route Misc', () => {
  test('Ping', async done => {
    return request(MainApp)
      .get('/ping')
      .then(res => {
        expect(res.statusCode).toEqual(200)
        done()
      })
  })

  test('Version', async done => {
    return request(MainApp)
      .get('/version')
      .then(res => {
        expect(res.statusCode).toEqual(200)
        done()
      })
  })
})
