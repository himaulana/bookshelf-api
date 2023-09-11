import * as BookController from './handler.js';

export default [
  {
    method: 'POST',
    path: '/books',
    handler: BookController.create,
  },
  {
    method: 'GET',
    path: '/books',
    handler: BookController.all,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: BookController.detail,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: BookController.update,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: BookController.remove,
  },
];
