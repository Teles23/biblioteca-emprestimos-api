import { Router } from 'express';

import { CategoriesController } from '../controllers/categories.controller';

export const categoriesRoutes = Router();

const categoriesController = new CategoriesController();

categoriesRoutes.get('/', categoriesController.list.bind(categoriesController));
