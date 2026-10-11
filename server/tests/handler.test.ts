import { describe, it, expect } from 'vitest';
import request from 'supertest';
import handler from '../../api/[...slug].js';

describe('Vercel API Handler (api/[...slug].ts)', () => {
  it('should export a callable handler wrapping Express app', async () => {
    expect(typeof handler).toBe('function');

    const res = await request(handler)
      .post('/api/research')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });

  it('should handle requests in production environment without PathError', async () => {
    process.env.NODE_ENV = 'production';
    process.env.VERCEL = '1';

    const res = await request(handler)
      .post('/api/research')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });
});
