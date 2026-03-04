import { type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../../../config/env';

interface TokenPayload {
  sub: string;
  email: string;
  roles: string[];
}

export function authMiddleware(request: Request, response: Response, next: NextFunction): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    response.status(401).json({ message: 'Token nao informado.' });
    return;
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as TokenPayload;

    request.user = {
      id: decoded.sub,
      email: decoded.email,
      roles: decoded.roles,
    };

    next();
  } catch {
    response.status(401).json({ message: 'Token invalido.' });
  }
}
