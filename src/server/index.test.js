import test from 'ava'
import request from 'supertest'
import app from '../../dist/server/index'

test('gets the main route', async t => {
  const response = await request(app)
    .get('/')

  t.is(200, response.status)
})

test('throws 404 for unregistered routes', async t => {
  const response = await request(app)
    .get('/doesnt_exist')

  t.is(404, response.status)
})
