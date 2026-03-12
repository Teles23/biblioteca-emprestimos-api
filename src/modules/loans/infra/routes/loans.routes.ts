import { Router } from 'express';

import { authMiddleware } from '../../../../shared/infra/middlewares/auth.middleware';
import { requireRole } from '../../../../shared/infra/middlewares/role.middleware';
import { LoansController } from '../controllers/loans.controller';

export const loansRoutes = Router();

const loansController = new LoansController();

loansRoutes.use(authMiddleware);

loansRoutes.get('/me', loansController.listMe.bind(loansController));
loansRoutes.post('/', loansController.create.bind(loansController));
loansRoutes.post('/:id/return', requireRole('ROLE_ADMIN'), loansController.returnLoan.bind(loansController));
loansRoutes.get('/active', requireRole('ROLE_ADMIN'), loansController.listActive.bind(loansController));
loansRoutes.get('/overdue', requireRole('ROLE_ADMIN'), loansController.listOverdue.bind(loansController));
loansRoutes.get('/history', requireRole('ROLE_ADMIN'), loansController.listHistory.bind(loansController));
