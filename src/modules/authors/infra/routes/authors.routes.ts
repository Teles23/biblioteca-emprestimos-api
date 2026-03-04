import { Router } from 'express';

import { authMiddleware } from '../../../../shared/infra/middlewares/auth.middleware';
import { requireRole } from '../../../../shared/infra/middlewares/role.middleware';
import { AuthorsController } from '../controllers/authors.controller';

export const authorsRoutes = Router();

const authorsController = new AuthorsController();

authorsRoutes.use(authMiddleware);
authorsRoutes.use(requireRole('ROLE_ADMIN'));

authorsRoutes.post('/', authorsController.create.bind(authorsController));
authorsRoutes.get('/', authorsController.list.bind(authorsController));
authorsRoutes.get('/:id', authorsController.findById.bind(authorsController));
authorsRoutes.put('/:id', authorsController.update.bind(authorsController));
authorsRoutes.delete('/:id', authorsController.delete.bind(authorsController));
