import { Router } from 'express';

import { authRoutes } from '../../../../modules/auth/infra/routes/auth.routes';
import { usersRoutes } from '../../../../modules/users/infra/routes/users.routes';
import { booksRoutes } from '../../../../modules/books/infra/routes/books.routes';
import { authorsRoutes } from '../../../../modules/authors/infra/routes/authors.routes';
import { categoriesRoutes } from '../../../../modules/categories/infra/routes/categories.routes';
import { loansRoutes } from '../../../../modules/loans/infra/routes/loans.routes';
import { dashboardRoutes } from '../../../../modules/dashboard/infra/routes/dashboard.routes';

export const router = Router();

router.get('/health', (_request, response) => {
  response.status(200).json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/books', booksRoutes);
router.use('/authors', authorsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/loans', loansRoutes);
router.use('/dashboard', dashboardRoutes);
