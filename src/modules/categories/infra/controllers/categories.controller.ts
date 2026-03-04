import { type Request, type Response } from 'express';

import { ListCategoriesUseCase } from '../../application/use-cases/list-categories.use-case';

export class CategoriesController {
  async list(_request: Request, response: Response): Promise<Response> {
    const useCase = new ListCategoriesUseCase();
    const data = await useCase.execute();

    return response.status(200).json(data);
  }
}
