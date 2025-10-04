# 🚀 Guia de Deploy - Offer Copilot

## Ambientes Suportados

O Offer Copilot foi desenvolvido para ser universalmente compatível com múltiplas plataformas de desenvolvimento e deploy.

### 1. Lovable.dev ✨

- **Auto-configuração**: ✅ Automática
- **Deploy**: Publicar direto pela interface do Lovable
- **Features**: LocalStorage, Supabase (opcional), File Upload
- **URL padrão**: `https://[seu-projeto].lovable.app`

**Passos:**
1. Desenvolva normalmente no Lovable
2. Clique em "Publish" no canto superior direito
3. Seu app está no ar!

---

### 2. Dyad 🔷

- **Exportar código** do Lovable
- **Configurar** variáveis de ambiente
- **Rodar** localmente ou fazer deploy

**Passos:**
1. Exporte o código do Lovable (Git ou Download)
2. Crie o arquivo `.env.local`:
   ```bash
   VITE_APP_ENV=dyad
   VITE_API_URL=http://localhost:8787
   ```
3. Instale dependências: `npm install`
4. Rode o projeto: `npm run dev`

---

### 3. V0.dev / Vercel 🔺

- **Importar** componentes React
- **Configurar** variáveis de ambiente no Vercel
- **Deploy**: Automático via Git

**Passos:**
1. Importe o repositório no Vercel
2. Configure environment variables:
   ```
   VITE_APP_ENV=v0
   VITE_API_URL=https://[seu-app].vercel.app
   ```
3. Deploy automático a cada push

---

### 4. Local Development 💻

- **Clonar** repositório
- **Configurar** ambiente local
- **Rodar** dev server

**Passos:**
1. Clone o repositório
2. Copie `.env.example` para `.env.local`
3. Ajuste as variáveis conforme necessário
4. Instale: `npm install`
5. Rode: `npm run dev`

---

## Variáveis de Ambiente

### Obrigatórias
Nenhuma! O app funciona 100% offline com LocalStorage.

### Opcionais

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_APP_ENV` | Ambiente de execução | `local` (auto-detectado) |
| `VITE_API_URL` | URL base da API | Varia por ambiente |
| `VITE_SUPABASE_URL` | URL do Supabase | - |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave pública Supabase | - |
| `VITE_GROQ_API_URL` | URL da API Groq | API padrão |
| `VITE_DEEPSEEK_API_URL` | URL da API DeepSeek | API padrão |
| `VITE_GEMINI_API_URL` | URL da API Gemini | API padrão |

---

## Compatibilidade de Features

| Feature | Lovable | Dyad | V0 | Local |
|---------|---------|------|-----|-------|
| LocalStorage | ✅ | ✅ | ✅ | ✅ |
| AI Providers | ✅ | ✅ | ✅ | ✅ |
| Admin Panel | ✅ | ✅ | ✅ | ✅ |
| Ferramentas | ✅ | ✅ | ✅ | ✅ |
| Supabase | ✅ | ❌ | ❌ | ❌ |
| File Upload | ✅ | ✅ | ✅ | ✅ |

---

## Provedores de IA Suportados

✅ **Groq** - API gratuita (llama-3.3-70b-versatile)  
✅ **DeepSeek** - API gratuita (deepseek-chat)  
✅ **Gemini** - API gratuita (gemini-2.0-flash-exp)

Todos funcionam em todos os ambientes sem backend obrigatório.

---

## Detecção Automática de Ambiente

O app detecta automaticamente o ambiente baseado no hostname:

- `*.lovable.dev` ou `*.lovable.app` → Lovable
- `*.dyad.app` ou `*.dyad.dev` → Dyad
- `*.vercel.app` ou `*.v0.dev` → V0
- Qualquer outro → Local

Para override manual, configure `VITE_APP_ENV` no `.env.local`.

---

## Troubleshooting

### Erro: "API Key não configurada"
- Verifique se configurou as API Keys nas Configurações do app
- As chaves são armazenadas no LocalStorage do navegador

### Erro: "Failed to fetch"
- Verifique sua conexão com a internet
- Confirme se a API Key é válida
- Veja o console do navegador para detalhes

### Badge mostrando ambiente errado
- Limpe o cache do navegador
- Configure `VITE_APP_ENV` manualmente no `.env.local`

---

## Recursos Adicionais

- [Documentação Lovable](https://docs.lovable.dev)
- [Groq API Docs](https://console.groq.com/docs)
- [DeepSeek API Docs](https://platform.deepseek.com/docs)
- [Gemini API Docs](https://ai.google.dev/docs)

---

## Suporte

Para questões ou problemas, abra uma issue no repositório ou entre em contato com o desenvolvedor.

**Desenvolvido com ❤️ para funcionar em qualquer lugar**
