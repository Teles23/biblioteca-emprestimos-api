import bcrypt from 'bcrypt';

import { LoginUseCase } from '../../src/modules/auth/application/use-cases/login.use-case';
import type { IAuthRepository } from '../../src/modules/auth/domain/repositories/IAuthRepository';
import { AppError } from '../../src/shared/errors/app-error';

describe('LoginUseCase', () => {
  const password = 'Strong@123';
  let authRepository: jest.Mocked<IAuthRepository>;

  beforeEach(() => {
    authRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };
  });

  it('should login successfully', async () => {
    const passwordHash = await bcrypt.hash(password, 10);

    authRepository.findByEmail.mockResolvedValue({
      id: 'user-1',
      email: 'john@example.com',
      passwordHash,
      roles: ['ROLE_USER'],
    });

    const useCase = new LoginUseCase(authRepository);
    const result = await useCase.execute({
      email: 'john@example.com',
      password,
    });

    expect(result.accessToken).toBeTruthy();
    expect(result.user).toEqual({
      id: 'user-1',
      email: 'john@example.com',
      roles: ['ROLE_USER'],
    });
  });

  it('should fail with invalid credentials', async () => {
    authRepository.findByEmail.mockResolvedValue(null);

    const useCase = new LoginUseCase(authRepository);

    await expect(
      useCase.execute({
        email: 'john@example.com',
        password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
