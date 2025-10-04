// API Key Manager - Gerencia chaves de API da empresa e do usuário
import { storage, KEYS } from './storage';

// API Keys da empresa (use variáveis de ambiente em produção)
const COMPANY_API_KEYS = {
  groq: import.meta.env.VITE_COMPANY_GROQ_KEY || 'gsk_company_default_key',
  deepseek: import.meta.env.VITE_COMPANY_DEEPSEEK_KEY || 'sk_company_default_key',
  gemini: import.meta.env.VITE_COMPANY_GEMINI_KEY || 'AIza_company_default_key',
};

/**
 * Obtém a API key para um provedor específico
 * Retorna a chave da empresa se o modo estiver ativo, senão retorna a chave do usuário
 */
export function getApiKey(provider: 'groq' | 'deepseek' | 'gemini'): string | null {
  const useCompanyApi = storage.get<boolean>('offer-copilot-use-company-api');
  
  // Se usar API da empresa (padrão ou explicitamente ativado)
  if (useCompanyApi === null || useCompanyApi === true) {
    const companyKey = COMPANY_API_KEYS[provider];
    console.info(`[API Manager] 🔑 Usando API da empresa para ${provider}`);
    return companyKey;
  }
  
  // Caso contrário, usar chave do usuário
  const userApiKeys = storage.get<Record<string, string>>(KEYS.API_KEYS) || {};
  const userKey = userApiKeys[provider];
  
  if (userKey) {
    console.info(`[API Manager] 🔑 Usando API pessoal para ${provider}`);
    return userKey;
  }
  
  console.warn(`[API Manager] ⚠️ Nenhuma API key configurada para ${provider}`);
  return null;
}

/**
 * Verifica se está usando a API da empresa
 */
export function isUsingCompanyApi(): boolean {
  const useCompanyApi = storage.get<boolean>('offer-copilot-use-company-api');
  return useCompanyApi === null || useCompanyApi === true;
}

/**
 * Verifica se um provedor tem API key disponível
 */
export function hasApiKey(provider: 'groq' | 'deepseek' | 'gemini'): boolean {
  return getApiKey(provider) !== null;
}
