const Book = require('./books')

const addBookHandler = async (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const db = request.server.plugins['hapi-mongodb'].db
  const collection = db.collection(Book.collection)

  const newBook = {
    name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt
  }

  const result = await collection.insertOne(newBook)
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: result.insertedId
    }
  })
  response.code(201)
  return response
}

const getAllBooksHandler = async (request, h) => {
  const { name, reading, finished } = request.query
  const db = request.server.plugins['hapi-mongodb'].db
  const collection = db.collection(Book.collection)

  const books = await collection.find({})

  if (name !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.filter(book => book.name.toLowerCase().includes(name.toLowerCase())).map(book => ({
          id: book._id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
  }

  if (reading !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.filter(book => book.reading === !!Number(reading)).map(book => ({
          id: book._id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
  }

  if (finished !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.filter(book => book.finished === !!Number(finished)).map(book => ({
          id: book._id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'success',
    data: {
      books
    }
  })
  response.code(200)
  return response
}

const getBookByIdHandler = async (request, h) => {
  const { bookId } = request.params
  const db = request.server.plugins['hapi-mongodb'].db
  const collection = db.collection(Book.collection)

  const book = await collection.findOne({ _id: bookId })

  if (!book) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
  }

  const response = h.response({
    status: 'success',
    data: {
      book
    }
  })
  response.code(200)
  return response
}

const editBookByIdHandler = async (request, h) => {
  const { bookId } = request.params

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const updatedAt = new Date().toISOString()
  const finished = pageCount === readPage

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const db = request.server.plugins['hapi-mongodb'].db
  const collection = db.collection(Book.collection)

  const book = await collection.updateOne({ _id: bookId }, { $set: { name, year, author, summary, publisher, pageCount, readPage, reading, finished, updatedAt } })

  if (book.matchedCount === 1) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = async (request, h) => {
  const { bookId } = request.params
  const db = request.server.plugins['hapi-mongodb'].db
  const collection = db.collection(Book.collection)

  const book = await collection.deleteOne({ _id: bookId })

  if (book.deletedCount === 1) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
