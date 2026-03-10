import { Router } from 'express';

import { authMiddleware } from '../../../../shared/infra/middlewares/auth.middleware';
import { requireRole } from '../../../../shared/infra/middlewares/role.middleware';
import { UsersController } from '../controllers/users.controller';

export const usersRoutes = Router();

const usersController = new UsersController();

usersRoutes.use(authMiddleware);

usersRoutes.get('/me', usersController.me.bind(usersController));
usersRoutes.get('/', requireRole('ROLE_ADMIN'), usersController.list.bind(usersController));
usersRoutes.get('/:id', requireRole('ROLE_ADMIN'), usersController.findById.bind(usersController));
usersRoutes.post('/', requireRole('ROLE_ADMIN'), usersController.create.bind(usersController));
usersRoutes.put('/:id', requireRole('ROLE_ADMIN'), usersController.update.bind(usersController));
usersRoutes.delete('/:id', requireRole('ROLE_ADMIN'), usersController.delete.bind(usersController));
