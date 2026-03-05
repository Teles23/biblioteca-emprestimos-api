import { Router } from 'express';
import { authMiddleware } from '../../../../shared/infra/middlewares/auth.middleware';
import { requireRole } from '../../../../shared/infra/middlewares/role.middleware';
import { DashboardController } from '../controllers/dashboard.controller';

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.get(
  '/stats', 
  authMiddleware, 
  requireRole('ROLE_ADMIN'), 
  dashboardController.handle.bind(dashboardController)
);

export { dashboardRoutes };
