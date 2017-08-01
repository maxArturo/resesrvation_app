import { getReservations as dbGet, addReservation, deleteReservation as dbDelete } from '../db/reservations'

export async function getReservations (req, res) {
  const reservations = await dbGet(req.params.id)
  if (!reservations || (Array.isArray(reservations) && !reservations.length)) {
    return res.status(404).send()
  }

  res.send(reservations)
}

export async function postReservation (req, res) {
  const {name, count, timeslot} = req.query

  if (!name || !count || !timeslot) {
    return res.status(400)
      .send(`name, count, timeslot must all be present`)
  }

  if (timeslot.length !== 10 || !timeslot.match(/\d{10}/)) {
    return res.status(400)
      .send('timeslot must be 10 digits (hour, day, month, year)')
  }

  try {
    const reservation = await addReservation(name, count, timeslot)
    res.status(201).send(reservation)
  } catch (e) {
    return res.status(404)
      .send(e.message)
  }
}

export async function deleteReservation (req, res) {
  if (!req.params.id) {
    return res.status(400).send('ID is required')
  }

  try {
    await dbDelete(req.params.id)
  } catch (e) {
    if (e.message.match('does not exist')) {
      return res.status(404).send()
    }
    return res.status(500).send(e.message)
  }
  return res.status(204).send()
}
