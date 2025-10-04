// Tools Registry - Dynamic Tool Management
// TODO: Sync with Supabase in future

import { storage, KEYS } from "./storage";
import type { ToolDefinition } from "@/types";
import { 
  Lightbulb, 
  Target, 
  Video, 
  Gift, 
  Users, 
  UserCheck, 
  Edit, 
  Anchor,
  Sparkles
} from "lucide-react";

const iconMap: Record<string, any> = {
  lightbulb: Lightbulb,
  target: Target,
  video: Video,
  gift: Gift,
  users: Users,
  userCheck: UserCheck,
  edit: Edit,
  anchor: Anchor,
  sparkles: Sparkles,
};

export const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || Sparkles;
};

// Default built-in tools
const defaultTools: ToolDefinition[] = [
  {
    id: "headline",
    name: "Headline Generator",
    description: "Crie headlines poderosas e irresistíveis",
    icon: "lightbulb",
    prompt: "Você é um copywriter experiente especializado em criar headlines que convertem. Crie headlines persuasivas baseadas nos inputs fornecidos.",
    inputs: [
      { id: "produto", label: "Produto/Serviço", type: "text", placeholder: "Ex: Curso de Marketing Digital", required: true },
      { id: "publico", label: "Público-Alvo", type: "text", placeholder: "Ex: Empreendedores iniciantes", required: true },
      { id: "emocao", label: "Emoção Principal", type: "select", required: true, options: ["Urgência", "Curiosidade", "Exclusividade", "Transformação", "Prova Social"] }
    ],
    outputType: "list",
    category: "Copywriting",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "hooks",
    name: "Hooks Generator",
    description: "Gere ganchos que capturam atenção",
    icon: "anchor",
    prompt: "Você é especialista em criar ganchos irresistíveis. Crie hooks que capturam atenção imediatamente.",
    inputs: [
      { id: "tema", label: "Tema", type: "text", placeholder: "Ex: Emagrecimento", required: true },
      { id: "angulo", label: "Ângulo", type: "textarea", placeholder: "Ex: Método rápido e sem dieta", required: true }
    ],
    outputType: "list",
    category: "Copywriting",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "vsl",
    name: "VSL Generator",
    description: "Scripts completos para Video Sales Letters",
    icon: "video",
    prompt: "Você é roteirista de VSL especializado em vendas. Crie roteiros completos e persuasivos.",
    inputs: [
      { id: "produto", label: "Produto", type: "text", required: true },
      { id: "problema", label: "Problema Principal", type: "textarea", required: true },
      { id: "solucao", label: "Solução Oferecida", type: "textarea", required: true }
    ],
    outputType: "text",
    category: "Video",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "oferta",
    name: "Oferta Generator",
    description: "Estruture ofertas irresistíveis",
    icon: "gift",
    prompt: "Você é especialista em estruturar ofertas de alto valor. Crie ofertas irresistíveis e completas.",
    inputs: [
      { id: "produto", label: "Produto Principal", type: "text", required: true },
      { id: "preco", label: "Preço", type: "number", required: true },
      { id: "bonus", label: "Bônus", type: "textarea", required: false }
    ],
    outputType: "text",
    category: "Ofertas",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "publico",
    name: "Pesquisa de Público",
    description: "Analise e entenda seu público-alvo",
    icon: "users",
    prompt: "Você é analista de público especializado. Analise profundamente o público-alvo fornecido.",
    inputs: [
      { id: "nicho", label: "Nicho", type: "text", required: true },
      { id: "produto", label: "Produto/Serviço", type: "text", required: true }
    ],
    outputType: "text",
    category: "Pesquisa",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "persona",
    name: "Pesquisa de Persona",
    description: "Crie personas detalhadas",
    icon: "userCheck",
    prompt: "Você é especialista em criação de personas. Crie personas detalhadas e acionáveis.",
    inputs: [
      { id: "negocio", label: "Tipo de Negócio", type: "text", required: true },
      { id: "objetivo", label: "Objetivo da Persona", type: "textarea", required: true }
    ],
    outputType: "json",
    category: "Pesquisa",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "editores",
    name: "Pesquisa de Editores",
    description: "Encontre editores de vídeo especializados",
    icon: "edit",
    prompt: "Você é recrutador especializado em profissionais de vídeo. Ajude a encontrar editores qualificados.",
    inputs: [
      { id: "estilo", label: "Estilo de Edição", type: "text", required: true },
      { id: "budget", label: "Orçamento", type: "text", required: false }
    ],
    outputType: "list",
    category: "Recrutamento",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ganchos",
    name: "Tipos de Ganchos",
    description: "Explore diferentes tipos de ganchos",
    icon: "target",
    prompt: "Você é especialista em diferentes tipos de ganchos persuasivos. Explique e exemplifique diversos tipos.",
    inputs: [
      { id: "contexto", label: "Contexto de Uso", type: "text", required: true }
    ],
    outputType: "list",
    category: "Copywriting",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Initialize default tools on first load
export const initializeTools = () => {
  const existing = storage.get<ToolDefinition[]>(KEYS.TOOLS);
  if (!existing || existing.length === 0) {
    storage.set(KEYS.TOOLS, defaultTools);
    return defaultTools;
  }
  return existing;
};

// Get all tools
export const getAllTools = (): ToolDefinition[] => {
  return storage.get<ToolDefinition[]>(KEYS.TOOLS) || defaultTools;
};

// Get tool by ID
export const getToolById = (id: string): ToolDefinition | undefined => {
  const tools = getAllTools();
  return tools.find(tool => tool.id === id);
};

// Create new tool
export const createTool = (tool: Omit<ToolDefinition, "createdAt" | "updatedAt">): ToolDefinition => {
  const tools = getAllTools();
  const newTool: ToolDefinition = {
    ...tool,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tools.push(newTool);
  storage.set(KEYS.TOOLS, tools);
  
  // Dispatch event for real-time updates
  window.dispatchEvent(new Event('toolsUpdated'));
  
  return newTool;
};

// Update tool
export const updateTool = (id: string, updates: Partial<ToolDefinition>): ToolDefinition | null => {
  const tools = getAllTools();
  const index = tools.findIndex(tool => tool.id === id);
  if (index === -1) return null;
  
  tools[index] = {
    ...tools[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  storage.set(KEYS.TOOLS, tools);
  
  // Dispatch event for real-time updates
  window.dispatchEvent(new Event('toolsUpdated'));
  
  return tools[index];
};

// Delete tool
export const deleteTool = (id: string): boolean => {
  const tools = getAllTools();
  const filtered = tools.filter(tool => tool.id !== id);
  if (filtered.length === tools.length) return false;
  storage.set(KEYS.TOOLS, filtered);
  
  // Dispatch event for real-time updates
  window.dispatchEvent(new Event('toolsUpdated'));
  
  return true;
};

// Get tools by category
export const getToolsByCategory = (category: string): ToolDefinition[] => {
  const tools = getAllTools();
  return tools.filter(tool => tool.category === category);
};

// Get all categories
export const getAllCategories = (): string[] => {
  const tools = getAllTools();
  const categories = new Set(tools.map(tool => tool.category).filter(Boolean));
  return Array.from(categories) as string[];
};
