import { describe, it, expect } from 'vitest';
import { GeminiProvider } from '../llm';

describe('LLM Provider Abstraction', () => {
  it('should require an API key for Gemini', () => {
    expect(() => new GeminiProvider('')).toThrow('Gemini API key is required');
  });

  // Note: We don't make real API calls in unit tests, so further testing 
  // would mock the GoogleGenerativeAI library.
});
