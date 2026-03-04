import bcrypt from 'bcrypt';

import { AppError } from '../../../../shared/errors/app-error';
import { validatePasswordStrength } from '../../../../shared/utils/password';
import type { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import type { RegisterDTO } from '../dtos/auth.dto';

export class RegisterUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute({ name, email, password }: RegisterDTO): Promise<{ id: string; email: string }> {
    if (!name || !email || !password) {
      throw new AppError('Nome, email e senha sao obrigatorios.', 400);
    }

    if (!validatePasswordStrength(password)) {
      throw new AppError('Senha fora da politica minima de seguranca.', 400);
    }

    const existingUser = await this.authRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError('Email ja cadastrado.', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.authRepository.create({
      name,
      email,
      password: hashedPassword,
      roles: ['ROLE_USER'],
    });

    return {
      id: user.id,
      email: user.email,
    };
  }
}
