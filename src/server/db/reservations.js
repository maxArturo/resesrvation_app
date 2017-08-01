import db from 'sqlite'

export async function getReservations (id) {
  if (id) {
    const reservation = await db.get('SELECT * from reservations WHERE id = ?', id)
    return reservation
  }

  const allReservations = await db.all('SELECT * from reservations')
  return allReservations
}

export async function addReservation (name) {
  const id = await db.run('INSERT INTO reservations (name) VALUES (?) RETURNING id', name)
  return id
}
