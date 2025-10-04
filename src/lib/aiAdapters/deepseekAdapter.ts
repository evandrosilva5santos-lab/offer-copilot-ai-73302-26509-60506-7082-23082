// DeepSeek AI Adapter
// Free tier: https://api.deepseek.com/v1

import { getApiKey } from '../apiKeyManager';

export async function runDeepSeek(
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>
): Promise<{ text: string; tokens?: number }> {
  // Se não foi passada uma chave, tenta obter do gerenciador
  const finalApiKey = apiKey || getApiKey('deepseek');
  
  if (!finalApiKey) {
    throw new Error('DeepSeek API key não configurada. Configure em Configurações > Chaves de API.');
  }
  
  // Support environment-specific API URL override
  const apiUrl = import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${finalApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model || 'deepseek-chat',
      messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${error}`);
  }

  const data = await response.json();
  return {
    text: data.choices[0]?.message?.content || '',
    tokens: data.usage?.total_tokens,
  };
}
