import { Router } from 'express';

import { AuthorsController } from '../controllers/authors.controller';

export const authorsRoutes = Router();

const authorsController = new AuthorsController();

authorsRoutes.get('/', authorsController.list.bind(authorsController));
