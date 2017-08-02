import test from 'ava'
import Promise from 'bluebird'
import moment from 'moment'
import db from 'sqlite'

import init from '../../../dist/server/db/provider'
import * as dbReservations from '../../../dist/server/db/reservations'

function insertReservation (tableId, name, count, timeslot) {
  return Promise.resolve(db.run(`INSERT INTO reservations (seating_table_id, name, patron_count, timeslot)
    VALUES(?, ?, ?, ?)`, tableId, name, count, timeslot || moment().format('YYYYMMDDHH')))
}

function getCounts (table) {
  return Promise.resolve(db.get(`SELECT COUNT(1) AS count FROM ${table}`))
}

test.before(async t => {
  await init()
})

test.afterEach(async t => {
  await db.migrate({force: 'last'})
})

test.serial('getReservations gets a reservation by ID', async t => {
  await insertReservation(3, 'testName', 3)
  const reservation = await dbReservations.getReservations(1)
  t.truthy(reservation)
})

test.serial('getReservations gets all reservations', async t => {
  await insertReservation(4, 'testName', 3)
  await insertReservation(2, 'testName', 1)
  await insertReservation(5, 'testName', 1)
  const reservation = await dbReservations.getReservations()
  t.is(3, reservation.length)
})

test.serial('getReservations fails to get reservation', async t => {
  const reservation = await dbReservations.getReservations(333)
  t.falsy(reservation)
})

test.serial('addReservation adds a reservation', async t => {
  const reservation = await dbReservations.addReservation('MrFoo', 3, moment().format('YYYYMMDDHH'))
  t.is(reservation.name, 'MrFoo')
  t.is(reservation.patron_count, 3)
  const counts = await getCounts('reservations')
  t.is(1, counts.count)
})

test.serial('addReservation does not add reservation for n + 1 tables on a given timeslot', async t => {
  const timeslot = moment().format('YYYYMMDDHH')
  const tableCount = await getCounts('seating_tables')

  const errorFunc = async () => {
    for (let i = 0; i <= tableCount.count; i++) {
      await dbReservations.addReservation('fooo', 1, timeslot)
    }
  }
  await t.throws(errorFunc())
})

test.serial('addReservation does not add for too large a reservation', async t => {
  const timeslot = moment().format('YYYYMMDDHH')
  const errorFunc = async () => {
    await dbReservations.addReservation('fooo', 300, timeslot)
  }

  await t.throws(errorFunc())
})

test.serial('deleteReservation does not delete for nonexisting reservation', async t => {
  const errorFunc = async () => {
    await dbReservations.deleteReservation(18)
  }

  await t.throws(errorFunc())
})

test.serial('deleteReservation deletes a reservation', async t => {
  await insertReservation(4, 'testName', 3)
  const preCount = await getCounts('reservations')
  t.is(preCount.count, 1)

  const execFunc = async () => {
    await dbReservations.deleteReservation(1)
  }

  await t.notThrows(execFunc())
  const count = await getCounts('reservations')
  t.is(count.count, 0)
})
