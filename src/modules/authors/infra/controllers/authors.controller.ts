import { type Request, type Response } from 'express';

import { ListAuthorsUseCase } from '../../application/use-cases/list-authors.use-case';

export class AuthorsController {
  async list(_request: Request, response: Response): Promise<Response> {
    const useCase = new ListAuthorsUseCase();
    const data = await useCase.execute();

    return response.status(200).json(data);
  }
}
