import {getReservations, postReservation, deleteReservation} from '../lib/reservationHandler'

const express = require('express')
const router = express.Router()

// get all the reservations
router.get('/', getReservations)

// get a reservation by id
router.get('/:id', getReservations)

// add a reservation
router.post('/', postReservation)

// modify a reservation
router.patch('/:id', (req, res) => {
  res.send('About birds')
})

// delete a reservation
router.delete('/:id', deleteReservation)

export default router
