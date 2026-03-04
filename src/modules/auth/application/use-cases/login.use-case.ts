import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { env } from '../../../../config/env';
import type { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import type { LoginDTO, LoginResponseDTO } from '../dtos/login.dto';

export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute({ email, password }: LoginDTO): Promise<LoginResponseDTO> {
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new Error('Credenciais inválidas.');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      throw new Error('Credenciais inválidas.');
    }

    const accessToken = jwt.sign({}, env.jwtSecret, {
      subject: user.id,
      expiresIn: '1d',
    });

    return { accessToken };
  }
}
