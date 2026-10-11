import { GoogleGenerativeAI } from '@google/generative-ai';

// Abstraction for LLM providers
export interface LLMProvider {
  generateCompletion(prompt: string, maxTokens?: number): Promise<string>;
}

export class GeminiProvider implements LLMProvider {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor(apiKey: string, modelName?: string) {
    if (!apiKey) {
      throw new Error("Gemini API key is required");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName || process.env.GEMINI_MODEL || "gemini-3.6-flash";
  }

  async generateCompletion(prompt: string, _maxTokens?: number): Promise<string> {
    const modelsToTry = [this.modelName];
    // If primary model hits high demand / 503, fallback to available sibling flash models
    if (this.modelName === 'gemini-3.6-flash') {
      modelsToTry.push('gemini-3.7-flash', 'gemini-3.5-flash');
    }

    let lastError: any;

    for (const modelName of modelsToTry) {
      const model = this.genAI.getGenerativeModel({ model: modelName });
      const maxRetries = 2;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const result = await model.generateContent(prompt);
          const response = await result.response;
          return response.text();
        } catch (error: any) {
          lastError = error;
          const status = error?.status;
          const isTransient =
            status === 503 ||
            status === 429 ||
            error?.message?.includes('503') ||
            error?.message?.includes('high demand');

          if (isTransient && attempt < maxRetries) {
            const delay = attempt * 1200;
            console.warn(
              `[GeminiProvider] Model ${modelName} returned high demand (503). Retrying in ${delay}ms...`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }
          break;
        }
      }

      console.warn(
        `[GeminiProvider] Model ${modelName} unavailable, falling back to next model...`
      );
    }

    throw lastError;
  }
}

// Factory to get the configured provider
export function getLLMProvider(): LLMProvider {
  const providerType = process.env.LLM_PROVIDER || 'gemini';
  
  if (providerType === 'gemini') {
    return new GeminiProvider(process.env.GEMINI_API_KEY || '');
  }
  
  throw new Error(`Unsupported LLM provider: ${providerType}`);
}
