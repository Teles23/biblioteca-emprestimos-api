import type { Request, Response } from 'express';
import { GetDashboardStatsUseCase } from '../../application/use-cases/get-dashboard-stats.use-case';

export class DashboardController {
  async handle(request: Request, response: Response): Promise<Response> {
    const getDashboardStats = new GetDashboardStatsUseCase();
    const stats = await getDashboardStats.execute();

    return response.json(stats);
  }
}
