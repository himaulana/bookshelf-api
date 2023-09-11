import { nanoid } from 'nanoid';
import books from './database.js';
import validate from './validate.js';

const mapBookData = (book) => ({
  id: book.id,
  name: book.name,
  publisher: book.publisher,
});

const response = (request, h, data) => {
  return h
    .response({
      status: 'success',
      data: {
        books: data,
      },
    })
    .code(200);
};

const booksName = (request, h, keyword) => {
  const filteredBooks = books
    .filter((item) =>
      item.name.toLowerCase().includes(keyword.trim().toLowerCase())
    )
    .map(mapBookData);

  return response(request, h, filteredBooks);
};

const isReading = (request, h, keyword) => {
  if (keyword !== '0') {
    const data = books.filter((book) => book.reading === true).map(mapBookData);

    return response(request, h, data);
  }

  const data = books.filter((book) => book.reading === false).map(mapBookData);

  return response(request, h, data);
};

const isFinished = (request, h, keyword) => {
  if (keyword !== '0') {
    const data = books
      .filter((book) => book.finished === true)
      .map(mapBookData);

    return response(request, h, data);
  }

  const data = books.filter((book) => book.finished === false).map(mapBookData);

  return response(request, h, data);
};

const create = (request, h) => {
  const validation = validate(request.payload, 'menambahkan');

  if (!validation.isValid) {
    return h.response(validation.response).code(400);
  }

  const { pageCount, readPage } = request.payload;
  const finished = pageCount === readPage;
  const id = nanoid(16);
  const currentTime = new Date().toISOString();
  const newBook = {
    id,
    ...request.payload,
    finished,
    insertedAt: currentTime,
    updatedAt: currentTime,
  };

  books.push(newBook);

  const isSuccess = books.find((item) => item.id === id);

  if (!isSuccess) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon coba lagi',
      })
      .code(500);
  }

  return h
    .response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: isSuccess.id,
      },
    })
    .code(201);
};

const all = (request, h) => {
  if (request.query.name) {
    const keyword = request.query.name;
    return booksName(request, h, keyword);
  }

  if (request.query.reading) {
    const reading = request.query.reading;
    return isReading(request, h, reading);
  }
  if (request.query.finished) {
    const finished = request.query.finished;
    return isFinished(request, h, finished);
  }

  const data = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return h
    .response({
      status: 'success',
      data: {
        books: data,
      },
    })
    .code(200);
};

const detail = (request, h) => {
  const { bookId } = request.params;

  const book = books.find((item) => item.id === bookId);

  if (!book) {
    return h
      .response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      })
      .code(404);
  }

  return h
    .response({
      status: 'success',
      data: {
        book,
      },
    })
    .code(200);
};

const update = (request, h) => {
  const { bookId } = request.params;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((item) => item.id === bookId);

  const validation = validate(request.payload, 'memperbarui');

  if (!validation.isValid) {
    return h.response(validation.response).code(400);
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      ...request.payload,
      updatedAt,
    };

    return h
      .response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      })
      .code(200);
  }

  return h
    .response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    .code(404);
};

const remove = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((item) => item.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return h
      .response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      })
      .code(200);
  }

  return h
    .response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    .code(404);
};

export { create, all, detail, update, remove };
