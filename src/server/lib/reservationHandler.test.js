import test from 'ava'
import sinon from 'sinon'

import * as dbReservations from '../../../dist/server/db/reservations'
import reservationHandler from '../../../dist/server/lib/reservationHandler'

test.beforeEach(t => {
  t.context.sandbox = sinon.sandbox.create()
})

test.afterEach(t => {
  t.context.sandbox.restore()
})

test.serial('getReservation sends 404 upon empty result', async function (t) {
  t.context.sandbox.stub(dbReservations, 'getReservations').returns(Promise.resolve(null))

  const sendStub = sinon.spy()
  const res = {
    status: sinon.stub().returns({send: sendStub})
  }

  await reservationHandler.getReservations({params: {}}, res)

  t.truthy(res.status.calledWith(404))
})

test.serial('getReservation sends result', async function (t) {
  t.context.sandbox.stub(dbReservations, 'getReservations').returns(Promise.resolve('something'))

  const sendStub = sinon.spy()
  const res = {send: sendStub}

  await reservationHandler.getReservations({params: {}}, res)

  t.truthy(sendStub.calledWith('something'))
})
