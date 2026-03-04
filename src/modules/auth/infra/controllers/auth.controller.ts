import { type Request, type Response } from 'express';

import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { AuthRepository } from '../repositories/auth.repository';

export class AuthController {
  async login(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    try {
      const useCase = new LoginUseCase(new AuthRepository());
      const result = await useCase.execute({ email, password });

      return response.status(200).json(result);
    } catch {
      return response.status(401).json({ message: 'Credenciais inválidas.' });
    }
  }
}
