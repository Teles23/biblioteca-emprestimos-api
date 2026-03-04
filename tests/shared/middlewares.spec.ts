import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../../src/config/env';
import { authMiddleware } from '../../src/shared/infra/middlewares/auth.middleware';
import { requireRole } from '../../src/shared/infra/middlewares/role.middleware';

function createResponseMock() {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  return { status, json };
}

describe('authMiddleware', () => {
  it('should return 401 when token is missing', () => {
    const request = { headers: {} } as Request;
    const response = createResponseMock() as unknown as Response;
    const next = jest.fn() as NextFunction;

    authMiddleware(request, response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should attach user payload when token is valid', () => {
    const token = jwt.sign(
      {
        email: 'john@example.com',
        roles: ['ROLE_USER'],
      },
      env.jwtSecret,
      {
        subject: 'user-1',
        expiresIn: '1h',
      },
    );

    const request = {
      headers: { authorization: `Bearer ${token}` },
    } as Request;
    const response = createResponseMock() as unknown as Response;
    const next = jest.fn() as NextFunction;

    authMiddleware(request, response, next);

    expect(request.user).toEqual({
      id: 'user-1',
      email: 'john@example.com',
      roles: ['ROLE_USER'],
    });
    expect(next).toHaveBeenCalled();
  });
});

describe('requireRole', () => {
  it('should return 403 when user does not have role', () => {
    const middleware = requireRole('ROLE_ADMIN');
    const request = {
      user: {
        id: 'user-1',
        email: 'john@example.com',
        roles: ['ROLE_USER'],
      },
    } as Request;
    const response = createResponseMock() as unknown as Response;
    const next = jest.fn() as NextFunction;

    middleware(request, response, next);

    expect(response.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
