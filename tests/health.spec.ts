import request from 'supertest';

import { app } from '../src/shared/infra/http/app';

describe('Health check', () => {
  it('should return ok', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
