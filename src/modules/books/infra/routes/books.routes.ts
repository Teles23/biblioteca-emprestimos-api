import { Router } from 'express';

import { authMiddleware } from '../../../../shared/infra/middlewares/auth.middleware';
import { requireRole } from '../../../../shared/infra/middlewares/role.middleware';
import { BooksController } from '../controllers/books.controller';

export const booksRoutes = Router();

const booksController = new BooksController();

booksRoutes.use(authMiddleware);

booksRoutes.get('/', booksController.list.bind(booksController));
booksRoutes.get('/:id', booksController.findById.bind(booksController));
booksRoutes.post('/', requireRole('ROLE_ADMIN'), booksController.create.bind(booksController));
booksRoutes.put('/:id', requireRole('ROLE_ADMIN'), booksController.update.bind(booksController));
booksRoutes.delete('/:id', requireRole('ROLE_ADMIN'), booksController.delete.bind(booksController));
