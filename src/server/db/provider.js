import db from 'sqlite'
import Promise from 'bluebird'

export default function initialize () {
  return db.open(process.env.RESERVATION_DB_FILENAME || ':memory:', { Promise })
    .then(() => db.migrate({ force: 'last' }))
    .then(() => process.env.NODE_ENV === 'development' && db.driver.on('trace', console.log))
    .then(() => db)
    .catch(err => console.log(err))
}
