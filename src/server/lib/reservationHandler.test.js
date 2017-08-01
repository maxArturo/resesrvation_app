import test from 'ava'
import Promise from 'bluebird'
import sinon from 'sinon'

import * as dbReservations from '../../../dist/server/db/reservations'
import reservationHandler from '../../../dist/server/lib/reservationHandler'

test.beforeEach(t => {
  t.context.sandbox = sinon.sandbox.create()
  t.context.sendStub = sinon.spy()
  t.context.res = {
    status: sinon.stub().returns({send: t.context.sendStub}),
    send: t.context.sendStub
  }
})

test.afterEach(t => {
  t.context.sandbox.restore()
})

test.serial('getReservation sends 404 upon empty result', async function (t) {
  t.context.sandbox.stub(dbReservations, 'getReservations').returns(Promise.resolve(null))

  await reservationHandler.getReservations({params: {}}, t.context.res)
  t.truthy(t.context.res.status.calledWith(404))
})

test.serial('getReservation sends result', async function (t) {
  t.context.sandbox.stub(dbReservations, 'getReservations').returns(Promise.resolve('something'))
  await reservationHandler.getReservations({params: {}}, t.context.res)

  t.truthy(t.context.sendStub.calledWith('something'))
})

test.serial('postReservation checks required params', async function (t) {
  t.context.sandbox.stub(dbReservations, 'addReservation').returns(Promise.resolve(''))

  const req = {query: {}}
  await reservationHandler.postReservation(req, t.context.res)

  t.truthy(t.context.res.status.calledWith(400))
  t.true(dbReservations.addReservation.notCalled)
})

test.serial('postReservation checks timeslot at least 10 chars', async function (t) {
  t.context.sandbox.stub(dbReservations, 'addReservation').returns(Promise.resolve(''))

  const req = {
    query: {
      name: 'test name',
      count: 3,
      timeslot: 2341
    }
  }
  await reservationHandler.postReservation(req, t.context.res)

  t.truthy(t.context.res.status.calledWith(400))
  t.true(t.context.sendStub.calledWith('timeslot must be 10 digits (hour, day, month, year)'))
  t.true(dbReservations.addReservation.notCalled)
})

test.serial('postReservation succeeds', async function (t) {
  t.context.sandbox.stub(dbReservations, 'addReservation').returns(Promise.resolve('new reservation'))

  const req = {
    query: {
      name: 'test name',
      count: 3,
      timeslot: '1018122017'
    }
  }
  await reservationHandler.postReservation(req, t.context.res)

  t.truthy(t.context.res.status.calledWith(201))
  t.true(t.context.sendStub.calledWith('new reservation'))
  t.true(dbReservations.addReservation.called)
})

test.serial('deleteReservation fails without id', async function (t) {
  t.context.sandbox.stub(dbReservations, 'deleteReservation').returns(null)

  const req = { params: {} }
  await reservationHandler.deleteReservation(req, t.context.res)

  t.truthy(t.context.res.status.calledWith(400))
  t.true(t.context.sendStub.calledWith('ID is required'))
  t.true(dbReservations.deleteReservation.notCalled)
})

test.serial('deleteReservation fails with internal error', async function (t) {
  const rejectedPromise = Promise.reject(new Error('whops'))
  t.context.sandbox.stub(dbReservations, 'deleteReservation').returns(rejectedPromise)

  const req = { params: {id: 333} }
  await reservationHandler.deleteReservation(req, t.context.res)

  t.truthy(t.context.res.status.calledWith(500))
  t.true(dbReservations.deleteReservation.called)
})

test.serial('deleteReservation fails with not found', async function (t) {
  const rejectedPromise = Promise.reject(new Error('does not exist'))
  t.context.sandbox.stub(dbReservations, 'deleteReservation').returns(rejectedPromise)

  const req = { params: {id: 333} }
  await reservationHandler.deleteReservation(req, t.context.res)

  t.truthy(t.context.res.status.calledWith(404))
  t.true(dbReservations.deleteReservation.called)
})

test.serial('deleteReservation succeeds', async function (t) {
  t.context.sandbox.stub(dbReservations, 'deleteReservation').returns(Promise.resolve('succeeded'))

  const req = { params: {id: 333} }
  await reservationHandler.deleteReservation(req, t.context.res)

  t.truthy(t.context.res.status.calledWith(204))
  t.true(dbReservations.deleteReservation.called)
})
