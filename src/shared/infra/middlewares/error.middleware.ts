import { type NextFunction, type Request, type Response } from 'express';
import { Prisma } from '@prisma/client';

import { AppError } from '../../errors/app-error';

export function errorMiddleware(
  error: Error,
  _request: Request,
  response: Response,
  next: NextFunction,
): Response {
  void next;

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return response.status(409).json({ message: 'Registro duplicado.' });
    }

    if (error.code === 'P2025') {
      return response.status(404).json({ message: 'Registro nao encontrado.' });
    }
  }

  return response.status(500).json({ message: 'Erro interno no servidor.' });
}
