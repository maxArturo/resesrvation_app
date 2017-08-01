import db from 'sqlite'

export async function getReservations (id) {
  if (id) {
    const reservation = await db.get('SELECT * from reservations WHERE id = ?', id)
    return reservation
  }

  const allReservations = await db.all('SELECT * from reservations')
  return allReservations
}

export async function addReservation (name, patronCount, timeslot) {
  // see if there are available tables
  const tables = await db.all(
    `SELECT * FROM seating_tables WHERE id NOT IN (
      SELECT seating_table_id FROM reservations WHERE timeslot = ?
    ) ORDER BY capacity ASC`, timeslot)

  if (tables.length) {
    // check which table fits best
    for (let table of tables) {
      if (patronCount <= table.capacity) {
        await db.run(`INSERT INTO reservations (seating_table_id, name, patron_count, timeslot) 
        VALUES (?, ?, ?, ?)`, table.id, name, patronCount, timeslot)
        const reservationResult = await db.get(`SELECT * from reservations WHERE seating_table_id = ? 
          AND name = ? and patron_count = ? and timeslot = ?`, table.id, name, patronCount, timeslot)
        return reservationResult
      }
    }
    throw new Error('no capacity for the selected timeslot')
  }

  throw new Error('no availablity for the selected timeslot')
}

export async function deleteReservation (id) {
  const exists = await db.get('SELECT * FROM reservations WHERE id = ?', id)
  if (!exists) {
    throw new Error('reservation does not exist')
  }

  await db.get('DELETE FROM reservations WHERE id = ?', id)
}
