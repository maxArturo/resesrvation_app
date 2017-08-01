import {getReservations} from '../db/reservations'
const express = require('express')
const router = express.Router()

// get all the reservations
router.get('/', async function (req, res) {
  // handle default case
  const reservations = await getReservations()
  res.send(reservations)
})

// get a reservation by id
router.get('/:id', async function (req, res) {
  // handle default case
  const reservations = await getReservations(req.params.id)
  res.send(reservations)
})

// add a reservation
router.post('/', (req, res) => {
  res.send('About birds')
})

// modify a reservation
router.patch('/:id', (req, res) => {
  res.send('About birds')
})

// delete a reservation
router.delete('/:id', (req, res) => {
  res.send('About birds')
})

export default router
