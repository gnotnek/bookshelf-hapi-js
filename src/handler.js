const Book = require('./books')

const addBookHandler = async (request, h) => {
  try {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt
    const finished = pageCount === readPage

    const book = new Book(name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt)

    if (book.name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku'
      })
      response.code(400)
      return response
    }
    if (book.readPage > book.pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
      })
      response.code(400)
      return response
    }

    await book.save()
    const isSuccess = book.id !== undefined
    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: book.id
        }
      })
      response.code(201)
      return response
    }
  } catch (error) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan'
    })
    response.code(500)
    return response
  }
}

const getAllBooksHandler = (request, h) => {
  return 'getAll'
}

const getBookByIdHandler = (request, h) => {
  return 'get by id'
}

const editBookByIdHandler = (request, h) => {
  return 'edit by id'
}

const deleteBookByIdHandler = (request, h) => {
  return 'delete by id'
}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
