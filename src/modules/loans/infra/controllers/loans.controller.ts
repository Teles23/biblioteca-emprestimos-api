import { type Request, type Response } from 'express';

import { ListLoansUseCase } from '../../application/use-cases/list-loans.use-case';

export class LoansController {
  async list(_request: Request, response: Response): Promise<Response> {
    const useCase = new ListLoansUseCase();
    const data = await useCase.execute();

    return response.status(200).json(data);
  }
}
