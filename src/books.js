const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  name: String,
  year: Number,
  author: String,
  summary: String,
  publisher: String,
  pageCount: Number,
  readPage: Number,
  reading: Boolean,
  finished: Boolean,
  insertedAt: String,
  updatedAt: String
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book
