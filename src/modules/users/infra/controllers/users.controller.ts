import { type Request, type Response } from 'express';

import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';

export class UsersController {
  async list(_request: Request, response: Response): Promise<Response> {
    const useCase = new ListUsersUseCase();
    const data = await useCase.execute();

    return response.status(200).json(data);
  }
}
