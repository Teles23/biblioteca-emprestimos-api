import { type NextFunction, type Request, type Response } from 'express';

export function requireRole(role: string) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const roles = request.user?.roles ?? [];

    if (!roles.includes(role)) {
      response.status(403).json({ message: 'Acesso negado.' });
      return;
    }

    next();
  };
}
