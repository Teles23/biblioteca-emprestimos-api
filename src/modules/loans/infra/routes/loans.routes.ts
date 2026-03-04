import { Router } from 'express';

import { LoansController } from '../controllers/loans.controller';

export const loansRoutes = Router();

const loansController = new LoansController();

loansRoutes.get('/', loansController.list.bind(loansController));
