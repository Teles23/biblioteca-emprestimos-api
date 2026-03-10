import bcrypt from 'bcrypt';
import { type NextFunction, type Request, type Response } from 'express';

import { AppError } from '../../../../shared/errors/app-error';
import { generateRandomPassword } from '../../../../shared/utils/password';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { UsersRepository } from '../repositories/users.repository';

export class UsersController {
  private readonly usersRepository = new UsersRepository();

  async list(_request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    try {
      const data = await new ListUsersUseCase(this.usersRepository).execute();

      return response.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const { name, email, phone } = request.body as {
      name?: string;
      email?: string;
      phone?: string;
    };

    try {
      if (!name || !email) {
        throw new AppError('Nome e email sao obrigatorios.', 400);
      }

      const existingUser = await this.usersRepository.findByEmail(email);

      if (existingUser) {
        throw new AppError('Email ja cadastrado.', 409);
      }

      const plainPassword = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const user = await this.usersRepository.create({
        name,
        email,
        phone,
        password: hashedPassword,
        roles: ['ROLE_USER'],
      });

      return response.status(201).json({
        ...user,
        generatedPassword: plainPassword,
      });
    } catch (error) {
      next(error);
    }
  }

  async me(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!request.user?.id) {
        throw new AppError('Nao autenticado.', 401);
      }

      const user = await this.usersRepository.findById(request.user.id);

      if (!user) {
        throw new AppError('Usuario nao encontrado.', 404);
      }

      return response.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async findById(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const { id } = request.params;
    try {
      const user = await this.usersRepository.findById(id);

      if (!user) {
        throw new AppError('Usuario nao encontrado.', 404);
      }

      return response.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const { id } = request.params;
    const { name, email, phone, roles, status } = request.body;
    try {
      const user = await this.usersRepository.update(id, { name, email, phone, roles, status });
      return response.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async delete(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const { id } = request.params;
    try {
      await this.usersRepository.delete(id);
      return response.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
