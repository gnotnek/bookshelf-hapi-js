const mongoose = require('mongoose')

const MONGO_DB_URI = 'mongodb://127.0.0.1:27017/bookshelf'

mongoose.connect(MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Successfully connect to database')
})

module.exports = mongoose
