import type { IAuthRepository } from '../../src/modules/auth/domain/repositories/IAuthRepository';
import { RegisterUseCase } from '../../src/modules/auth/application/use-cases/register.use-case';
import { AppError } from '../../src/shared/errors/app-error';

describe('RegisterUseCase', () => {
  let authRepository: jest.Mocked<IAuthRepository>;

  beforeEach(() => {
    authRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };
  });

  it('should register user with valid payload', async () => {
    authRepository.findByEmail.mockResolvedValue(null);
    authRepository.create.mockResolvedValue({
      id: 'new-user',
      email: 'new@example.com',
      passwordHash: 'hashed',
      roles: ['ROLE_USER'],
    });

    const useCase = new RegisterUseCase(authRepository);
    const result = await useCase.execute({
      name: 'New User',
      email: 'new@example.com',
      password: 'Strong@123',
    });

    expect(result).toEqual({
      id: 'new-user',
      email: 'new@example.com',
    });
    expect(authRepository.create).toHaveBeenCalled();
  });

  it('should fail when password is weak', async () => {
    const useCase = new RegisterUseCase(authRepository);

    await expect(
      useCase.execute({
        name: 'Weak User',
        email: 'weak@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should fail when email already exists', async () => {
    authRepository.findByEmail.mockResolvedValue({
      id: 'existing',
      email: 'existing@example.com',
      passwordHash: 'hash',
      roles: ['ROLE_USER'],
    });

    const useCase = new RegisterUseCase(authRepository);

    await expect(
      useCase.execute({
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'Strong@123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
