# 🔑 Sistema de API Keys - Offer Copilot

## Visão Geral

O Offer Copilot implementa um sistema dual de gerenciamento de API keys que permite:

1. **API da Empresa (Grátis)** - Chaves compartilhadas configuradas pelo administrador
2. **API Pessoal** - Chaves próprias dos usuários para maior controle e limites

## Como Funciona

### 1. Modo Padrão: API da Empresa (Recomendado)

Por padrão, o app usa as chaves da empresa configuradas nas variáveis de ambiente:

```env
VITE_COMPANY_GROQ_KEY=gsk_your_company_key
VITE_COMPANY_DEEPSEEK_KEY=sk_your_company_key
VITE_COMPANY_GEMINI_KEY=AIza_your_company_key
```

**Vantagens:**
- ✅ Acesso gratuito e imediato para todos os usuários
- ✅ Sem necessidade de cadastrar chaves próprias
- ✅ Perfeito para onboarding e testes
- ✅ Funciona out-of-the-box

### 2. Modo Avançado: API Pessoal

Usuários podem desativar "Usar API da Empresa" em **Configurações > Chaves de API** e adicionar suas próprias chaves.

**Vantagens:**
- 🔒 Controle total sobre uso e limites
- 📊 Métricas individualizadas
- 🚀 Maior throughput se usar planos pagos
- 🔐 Isolamento de recursos

## Configuração para Desenvolvedores

### 1. Configurar Chaves da Empresa

Crie um arquivo `.env.local` (não commitar!) com as chaves reais:

```env
# API Keys da Empresa (Compartilhadas)
VITE_COMPANY_GROQ_KEY=gsk_abc123...
VITE_COMPANY_DEEPSEEK_KEY=sk_xyz789...
VITE_COMPANY_GEMINI_KEY=AIzaSy...
```

### 2. Obter Chaves Gratuitas

#### Groq (Recomendado - Muito rápido)
1. Acesse: https://console.groq.com
2. Crie uma conta gratuita
3. Gere uma API key
4. Free tier: 14,400 requests/dia, 30 req/minuto

#### DeepSeek (Pesquisa Avançada)
1. Acesse: https://platform.deepseek.com
2. Cadastre-se
3. Obtenha API key
4. Free tier generoso para testes

#### Gemini (Google)
1. Acesse: https://makersuite.google.com/app/apikey
2. Login com conta Google
3. Crie chave de API
4. 60 requests/minuto grátis

### 3. Arquitetura do Sistema

```typescript
// src/lib/apiKeyManager.ts
export function getApiKey(provider: 'groq' | 'deepseek' | 'gemini'): string | null {
  // 1. Verifica se deve usar API da empresa
  const useCompanyApi = storage.get<boolean>('offer-copilot-use-company-api');
  
  // 2. Se sim, retorna chave da empresa
  if (useCompanyApi !== false) {
    return COMPANY_API_KEYS[provider];
  }
  
  // 3. Caso contrário, retorna chave do usuário
  const userKeys = storage.get(KEYS.API_KEYS) || {};
  return userKeys[provider] || null;
}
```

### 4. Uso nos Adapters

Todos os adapters de IA (Groq, DeepSeek, Gemini) agora usam o API Key Manager:

```typescript
// src/lib/aiAdapters/groqAdapter.ts
import { getApiKey } from '../apiKeyManager';

export async function runGroq(apiKey: string, model: string, messages: any) {
  // Fallback automático para chave gerenciada se não fornecida
  const finalApiKey = apiKey || getApiKey('groq');
  
  if (!finalApiKey) {
    throw new Error('Groq API key não configurada');
  }
  
  // ... resto da implementação
}
```

## Interface do Usuário

### Tela de Configurações

Em **Configurações > Chaves de API**, o usuário vê:

1. **Toggle "Usar API da Empresa"**
   - ✅ Ativado (padrão): Usa chaves compartilhadas
   - ❌ Desativado: Exibe campos para chaves pessoais

2. **Campos Condicionais**
   - Groq API Key (com link para console.groq.com)
   - DeepSeek API Key (com link para platform.deepseek.com)
   - Gemini API Key (com link para AI Studio)

3. **Avisos de Segurança**
   - Chaves armazenadas localmente no navegador
   - Nunca compartilhar chaves de API

## Segurança

### ✅ Boas Práticas Implementadas

1. **Armazenamento Local**: Chaves do usuário ficam no `localStorage`
2. **Input Type Password**: Campos de API key usam `type="password"`
3. **Validação**: Verificação antes de chamadas à API
4. **Mensagens Claras**: Erros informativos quando chave não configurada

### ⚠️ Avisos

1. **Não commitar** `.env.local` no Git
2. **Rotacionar chaves** da empresa periodicamente
3. **Monitorar uso** das chaves compartilhadas
4. **Rate limits** podem afetar múltiplos usuários no modo empresa

## Fluxo de Decisão

```
Usuário inicia uma ferramenta de IA
            ↓
    Verificar configuração
            ↓
   Usar API da Empresa? ──YES──> Pegar VITE_COMPANY_*_KEY
            ↓                            ↓
           NO                    Fazer requisição
            ↓                            ↓
   Pegar chave do localStorage      Retornar resultado
            ↓
   Chave existe? ──NO──> Erro: Configure API Key
            ↓
          YES
            ↓
   Fazer requisição
            ↓
   Retornar resultado
```

## Troubleshooting

### Erro: "API Key não configurada"

**Solução 1**: Ativar "Usar API da Empresa"
1. Ir em Configurações > Chaves de API
2. Ativar o toggle "Usar API da Empresa (Grátis)"
3. Salvar

**Solução 2**: Adicionar chave pessoal
1. Desativar "Usar API da Empresa"
2. Obter chave em console.groq.com (ou outro provedor)
3. Colar no campo correspondente
4. Salvar

### Erro: Rate Limit Exceeded

Se usando API da empresa:
- Aguarde alguns minutos (rate limits compartilhados)
- Considere usar chave pessoal

Se usando API pessoal:
- Verifique limites no console do provedor
- Upgrade para plano pago se necessário

## Próximos Passos

### Para Produção

1. **Migrar para Supabase Edge Functions**
   - Armazenar chaves da empresa em Supabase Secrets
   - Fazer proxy das requisições via backend
   - Adicionar rate limiting por usuário

2. **Dashboard de Uso**
   - Monitorar consumo por usuário
   - Alertas de limite
   - Estatísticas em tempo real

3. **Planos Premium**
   - Free: API da empresa com rate limits
   - Pro: Chaves pessoais + prioridade
   - Enterprise: Chaves dedicadas + SLA

## Referências

- [Groq Documentation](https://console.groq.com/docs)
- [DeepSeek API](https://platform.deepseek.com/api-docs)
- [Google AI Studio](https://ai.google.dev/)
- [Supabase Secrets](https://supabase.com/docs/guides/functions/secrets)
