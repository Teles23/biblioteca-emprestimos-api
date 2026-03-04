import { type NextFunction, type Request, type Response } from 'express';

import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { AuthRepository } from '../repositories/auth.repository';

export class AuthController {
  async register(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const { name, email, password } = request.body;

    try {
      const useCase = new RegisterUseCase(new AuthRepository());
      const result = await useCase.execute({ name, email, password });

      return response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const { email, password } = request.body;

    try {
      const useCase = new LoginUseCase(new AuthRepository());
      const result = await useCase.execute({ email, password });

      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
