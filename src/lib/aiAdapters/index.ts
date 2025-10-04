// AI Adapters Hub

import { runGroq } from './groqAdapter';
import { runDeepSeek } from './deepseekAdapter';
import { runGemini } from './geminiAdapter';

export type AIProviderType = 'groq' | 'deepseek' | 'gemini';

export async function runAI(
  provider: AIProviderType,
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>
): Promise<{ text: string; tokens?: number }> {
  switch (provider) {
    case 'groq':
      return runGroq(apiKey, model, messages);
    case 'deepseek':
      return runDeepSeek(apiKey, model, messages);
    case 'gemini':
      return runGemini(apiKey, model, messages);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export { runGroq, runDeepSeek, runGemini };
