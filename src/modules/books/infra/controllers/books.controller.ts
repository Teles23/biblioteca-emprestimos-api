import { type Request, type Response } from 'express';

import { ListBooksUseCase } from '../../application/use-cases/list-books.use-case';

export class BooksController {
  async list(_request: Request, response: Response): Promise<Response> {
    const useCase = new ListBooksUseCase();
    const data = await useCase.execute();

    return response.status(200).json(data);
  }
}
