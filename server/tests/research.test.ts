import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import * as researchModule from '../research.js';

describe('Research API Route (/api/research and /research)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 400 when query is missing', async () => {
    const res = await request(app)
      .post('/api/research')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
    expect(res.body.message).toBe('Query is required');
  });

  it('should return 400 on fallback route /research when query is missing', async () => {
    const res = await request(app)
      .post('/research')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });

  it('should execute Fast Search successfully', async () => {
    const mockReport = {
      title: 'Fast Research Title',
      summary: 'Summary of findings',
      sections: [{ heading: 'Section 1', content: 'Details [1]' }],
      sources: [{ id: 1, title: 'Source 1', url: 'https://example.com', domain: 'example.com' }],
      followUpQuestions: ['Next question?'],
      depth: 'fast'
    };

    vi.spyOn(researchModule, 'executeResearch').mockResolvedValue(mockReport);

    const res = await request(app)
      .post('/api/research')
      .send({ query: 'Quantum computing breakthroughs', depth: 'fast' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Fast Research Title');
    expect(res.body.depth).toBe('fast');
    expect(res.body.sessionId).toBeDefined();
    expect(researchModule.executeResearch).toHaveBeenCalledWith('Quantum computing breakthroughs', 'fast');
  });

  it('should execute Deep Research successfully', async () => {
    const mockReport = {
      title: 'Deep Research Title',
      summary: 'Comprehensive analysis',
      sections: [{ heading: 'Deep Dive', content: 'Deep details [1]' }],
      sources: [{ id: 1, title: 'Source 1', url: 'https://example.com/deep', domain: 'example.com' }],
      followUpQuestions: ['Next deep question?'],
      depth: 'deep'
    };

    vi.spyOn(researchModule, 'executeResearch').mockResolvedValue(mockReport);

    const res = await request(app)
      .post('/api/research')
      .send({ query: 'Artificial General Intelligence architectures', depth: 'deep' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Deep Research Title');
    expect(res.body.depth).toBe('deep');
    expect(res.body.sessionId).toBeDefined();
    expect(researchModule.executeResearch).toHaveBeenCalledWith('Artificial General Intelligence architectures', 'deep');
  });

  it('should return 500 when research execution throws an error', async () => {
    vi.spyOn(researchModule, 'executeResearch').mockRejectedValue(new Error('Search provider quota exceeded'));

    const res = await request(app)
      .post('/api/research')
      .send({ query: 'Error query', depth: 'fast' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal Server Error');
    expect(res.body.message).toBe('Search provider quota exceeded');
  });
});
