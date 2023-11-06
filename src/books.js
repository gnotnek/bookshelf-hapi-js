const Books = {
  collection: 'books',
  schema: {
    name: String,
    author: String,
    year: Number,
    summary: String,
    publisher: String,
    pageCount: Number,
    readPage: Number,
    reading: Boolean
  }
}

module.exports = Books
