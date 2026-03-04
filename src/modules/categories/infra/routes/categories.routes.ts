import { Router } from 'express';

import { authMiddleware } from '../../../../shared/infra/middlewares/auth.middleware';
import { requireRole } from '../../../../shared/infra/middlewares/role.middleware';
import { CategoriesController } from '../controllers/categories.controller';

export const categoriesRoutes = Router();

const categoriesController = new CategoriesController();

categoriesRoutes.use(authMiddleware);
categoriesRoutes.use(requireRole('ROLE_ADMIN'));

categoriesRoutes.post('/', categoriesController.create.bind(categoriesController));
categoriesRoutes.get('/', categoriesController.list.bind(categoriesController));
categoriesRoutes.get('/:id', categoriesController.findById.bind(categoriesController));
categoriesRoutes.put('/:id', categoriesController.update.bind(categoriesController));
categoriesRoutes.delete('/:id', categoriesController.delete.bind(categoriesController));
