// Gemini AI Adapter
// Google AI Studio: https://generativelanguage.googleapis.com

export async function runGemini(
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>
): Promise<{ text: string; tokens?: number }> {
  // Convert OpenAI format to Gemini format
  const contents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const modelName = model || 'gemini-2.0-flash-exp';
  // Support environment-specific API URL override
  const baseUrl = import.meta.env.VITE_GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta';
  const url = `${baseUrl}/models/${modelName}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contents }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  return {
    text,
    tokens: data.usageMetadata?.totalTokenCount,
  };
}
