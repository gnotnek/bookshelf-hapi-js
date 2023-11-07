const Book = require('./books')

const addBookHandler = async (request, h) => {
  try {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

    const finished = pageCount === readPage
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

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

    const book = new Book({ name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt })
    await book.save()
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: book.id
      }
    })
    response.code(201)
    return response
  } catch (error) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan'
    })
    response.code(500)
    return response
  }
}

const getAllBooksHandler = async (request, h) => {
  try {
    const books = await Book.find()
    const response = h.response({
      status: 'success',
      data: {
        books
      }
    })
    response.code(200)
    return response
  } catch (err) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan'
    })
    response.code(500)
    return response
  }
}

const getBookByIdHandler = async (request, h) => {
  try {
    const bookId = request.params.bookId
    const book = await Book.findById(bookId)

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
  } catch (err) {
    const response = h.response({
      status: 'error',
      message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
  }
}

const editBookByIdHandler = async (request, h) => {
  try {
    const bookId = request.params.bookId
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
    const updatedAt = new Date().toISOString()
    const finished = pageCount === readPage

    const updatedBook = await Book.findByIdAndUpdate(bookId, { name, year, author, summary, publisher, pageCount, readPage, reading, finished, updatedAt })

    if (!updatedBook) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
      })
      response.code(404)
      return response
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  } catch (err) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku'
    })
    response.code(500)
    return response
  }
}

const deleteBookByIdHandler = async (request, h) => {
  try {
    const bookId = request.params.bookId
    const deletedBook = await Book.findByIdAndDelete(bookId)

    if (!deletedBook) {
      const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
      })
      response.code(404)
      return response
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  } catch (err) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus'
    })
    response.code(500)
    return response
  }
}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
