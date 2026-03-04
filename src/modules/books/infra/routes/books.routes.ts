import { Router } from 'express';

import { BooksController } from '../controllers/books.controller';

export const booksRoutes = Router();

const booksController = new BooksController();

booksRoutes.get('/', booksController.list.bind(booksController));
