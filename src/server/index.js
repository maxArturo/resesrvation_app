import 'babel-polyfill'
import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'

import db from './db'
import routes from './routes'

const app = express()
const port = process.env.PORT || 3001

app.use(helmet())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/reservations', routes.reservations)

app.get('/', (req, res) => {
  // render the main app
  return res.send('Hello World!')
})

db.connect().then(db =>
  app.listen(port, () => {
    console.log(`Reservation app listening on port ${port}`)
  })
)

export default app
