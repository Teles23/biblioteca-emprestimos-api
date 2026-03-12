import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { env } from '../../../../config/env';
import { AppError } from '../../../../shared/errors/app-error';
import type { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import type { LoginDTO, LoginResponseDTO } from '../dtos/login.dto';

export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute({ email, password }: LoginDTO): Promise<LoginResponseDTO> {
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Credenciais invalidas.', 401);
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError('Credenciais invalidas.', 401);
    }

    const accessToken = jwt.sign({ email: user.email, roles: user.roles }, env.jwtSecret, {
      subject: user.id,
      expiresIn: '1d',
    });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
    };
  }
}
