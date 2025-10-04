# Sistema de Administração - Offer Copilot

## 🎯 Visão Geral

O **Offer Copilot** agora possui um sistema completo de administração que permite gerenciar ferramentas IA de forma dinâmica, sem necessidade de código.

## 🔑 Ativando o Modo Admin

Para ativar o modo administrador, pressione:

```
Ctrl + Alt + A
```

Você verá um badge vermelho "Admin Mode" aparecer no header e terá acesso ao painel administrativo.

## 📁 Estrutura do Sistema

```
src/
├── pages/admin/
│   ├── AdminLayout.tsx        # Layout do painel admin
│   ├── AdminSidebar.tsx       # Sidebar específica do admin
│   ├── Dashboard.tsx          # Dashboard com estatísticas
│   ├── Tools.tsx              # CRUD de ferramentas
│   ├── Users.tsx              # Gestão de usuários (mock)
│   └── Settings.tsx           # Configurações do sistema
│
├── pages/tools/
│   └── DynamicTool.tsx        # Componente genérico para qualquer ferramenta
│
├── lib/
│   ├── toolsRegistry.ts       # Sistema de registro de ferramentas
│   ├── adminStorage.ts        # Funções de admin e localStorage
│   └── storage.ts             # Helper de localStorage
│
└── hooks/
    └── useAdminMode.ts        # Hook para controle do modo admin
```

## 🛠️ Funcionalidades Admin

### 1. Dashboard Admin (`/admin/dashboard`)
- Estatísticas gerais do sistema
- Total de ferramentas criadas
- Usuários ativos
- Execuções totais
- Distribuição por categoria
- Atividade recente

### 2. Gerenciar Ferramentas (`/admin/tools`)
- **Criar** novas ferramentas IA
- **Editar** ferramentas existentes
- **Excluir** ferramentas
- Configurar:
  - Nome e descrição
  - Ícone
  - Categoria
  - Campos de entrada (inputs)
  - Prompt base para IA
  - Tipo de saída (texto, lista, JSON)

### 3. Usuários (`/admin/users`)
- Lista de usuários cadastrados (mock)
- Estatísticas de uso por usuário
- Papel (admin/user)

### 4. Configurações (`/admin/settings`)
- Tema padrão do sistema
- Provedor IA padrão (Groq, DeepSeek, Gemini)
- Modelo padrão
- Auto-save

## 🎨 Sistema de Ferramentas Dinâmicas

### Como Criar uma Nova Ferramenta

1. Ative o modo admin (`Ctrl+Alt+A`)
2. Vá para **Admin Panel** > **Ferramentas**
3. Clique em "Nova Ferramenta"
4. Preencha os dados:
   - **Nome**: Ex: "Gerador de E-mails"
   - **Descrição**: Ex: "Crie e-mails persuasivos"
   - **Categoria**: Ex: "Marketing"
   - **Ícone**: Escolha um ícone Lucide
   - **Prompt Base**: Instruções para a IA
   - **Tipo de Saída**: texto, lista ou JSON

5. Adicione campos de entrada:
   - Label do campo
   - Tipo (text, textarea, select, number)
   - Se é obrigatório
   - Opções (para select)

6. Clique em "Criar"

A ferramenta aparecerá automaticamente na página **Ferramentas** para todos os usuários!

### Formato dos Dados

Ferramentas são armazenadas em `localStorage` com a chave `offer-copilot-tools`:

```typescript
interface ToolDefinition {
  id: string;                          // ID único (gerado automaticamente)
  name: string;                        // Nome da ferramenta
  description: string;                 // Descrição curta
  icon: string;                        // Nome do ícone Lucide
  prompt: string;                      // Prompt base para IA
  inputs: ToolInput[];                 // Campos de entrada
  outputType: "text" | "list" | "json"; // Tipo de saída
  category?: string;                   // Categoria (opcional)
  createdAt: string;                   // Data de criação
  updatedAt: string;                   // Data de atualização
}

interface ToolInput {
  id: string;                          // ID do campo
  label: string;                       // Label exibida
  type: "text" | "textarea" | "select" | "number";
  placeholder?: string;                // Placeholder opcional
  required: boolean;                   // Se é obrigatório
  options?: string[];                  // Opções para select
}
```

## 🔐 Sistema de Permissões

### LocalStorage (Atual)

```javascript
// Verificar se é admin
const isAdmin = localStorage.getItem("offer-copilot-admin") === "true";

// Ativar modo admin
localStorage.setItem("offer-copilot-admin", "true");

// Desativar modo admin
localStorage.setItem("offer-copilot-admin", "false");
```

### Rotas Protegidas

```typescript
// Em App.tsx
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAdminMode();
  return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
}

<Route path="/admin/*" element={<AdminRoute>...</AdminRoute>} />
```

## 📦 Ferramentas Padrão

O sistema vem com 8 ferramentas pré-configuradas:

1. **Headline Generator** - Cria headlines persuasivas
2. **Hooks Generator** - Gera ganchos que capturam atenção
3. **VSL Generator** - Scripts completos para Video Sales Letters
4. **Oferta Generator** - Estrutura ofertas irresistíveis
5. **Pesquisa de Público** - Analisa público-alvo
6. **Pesquisa de Persona** - Cria personas detalhadas
7. **Pesquisa de Editores** - Encontra editores especializados
8. **Tipos de Ganchos** - Explora diferentes tipos de ganchos

## 🚀 Próximos Passos (TODO)

### Integração Supabase

```typescript
// TODO: Substituir localStorage por Supabase
// 1. Criar tabela 'tools' no Supabase
// 2. Criar tabela 'user_roles' no Supabase
// 3. Implementar RLS policies
// 4. Migrar funções de toolsRegistry.ts
// 5. Migrar funções de adminStorage.ts
```

### Melhorias Planejadas

- [ ] Sistema de permissões granular (criar, editar, deletar)
- [ ] Versionamento de ferramentas
- [ ] Templates de ferramentas
- [ ] Importar/Exportar ferramentas (JSON)
- [ ] Auditoria de mudanças
- [ ] Estatísticas detalhadas por ferramenta
- [ ] A/B testing de prompts
- [ ] Integração real com IA (atualmente mockado)

## 🎯 Fluxo de Uso

### Para Usuários Normais
1. Acesse `/ferramentas`
2. Veja todas as ferramentas disponíveis
3. Clique em uma ferramenta
4. Preencha os campos
5. Gere o conteúdo com IA

### Para Administradores
1. Pressione `Ctrl+Alt+A` para ativar modo admin
2. Acesse `/admin/dashboard`
3. Navegue pelas opções:
   - Ver estatísticas
   - Gerenciar ferramentas
   - Ver usuários
   - Ajustar configurações
4. Crie/edite ferramentas conforme necessário
5. As mudanças aparecem instantaneamente para usuários

## 🔧 Desenvolvimento

### Adicionar Novo Ícone

1. Importe de `lucide-react`:
```typescript
import { NewIcon } from "lucide-react";
```

2. Adicione ao `iconMap` em `toolsRegistry.ts`:
```typescript
const iconMap = {
  // ... existentes
  newIcon: NewIcon,
};
```

3. Adicione às opções em `Tools.tsx`:
```typescript
const iconOptions = [
  // ... existentes
  { value: "newIcon", label: "New Icon" },
];
```

### Escutar Mudanças em Ferramentas

```typescript
useEffect(() => {
  const handleToolsUpdate = () => {
    // Recarregar ferramentas
    setTools(getAllTools());
  };
  
  window.addEventListener('toolsUpdated', handleToolsUpdate);
  return () => window.removeEventListener('toolsUpdated', handleToolsUpdate);
}, []);
```

## 📝 Notas Técnicas

- **Real-time Updates**: Sistema usa eventos customizados (`toolsUpdated`) para atualização em tempo real
- **Type Safety**: TypeScript garante tipagem forte em todo o sistema
- **Responsive**: Interface totalmente responsiva (mobile-first)
- **Animations**: Framer Motion e Tailwind para microinterações
- **Theme Support**: Suporte completo a tema claro/escuro

## 🐛 Troubleshooting

### Ferramentas não aparecem
- Verifique o localStorage: `localStorage.getItem('offer-copilot-tools')`
- Execute `initializeTools()` no console
- Limpe o cache do navegador

### Modo admin não ativa
- Verifique se o atalho funciona: `Ctrl+Alt+A`
- Verifique localStorage: `localStorage.getItem('offer-copilot-admin')`
- Recarregue a página

### Erro ao criar ferramenta
- Todos os campos obrigatórios devem estar preenchidos
- Verifique o console para erros
- Verifique se o localStorage não está cheio

---

**Desenvolvido com ❤️ para Offer Copilot**
