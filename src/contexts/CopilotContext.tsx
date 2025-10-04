import { createContext, useContext, useState, ReactNode } from "react";
import { runAI } from "@/lib/aiAdapters";
import { storage, KEYS } from "@/lib/storage";
import type { AppSettings } from "@/types";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  files?: Array<{ name: string; size: number; type: string; url: string }>;
}

interface CopilotContextType {
  isOpen: boolean;
  messages: Message[];
  isProcessing: boolean;
  openCopilot: () => void;
  closeCopilot: () => void;
  toggleCopilot: () => void;
  sendMessage: (content: string, files?: File[]) => Promise<void>;
  clearMessages: () => void;
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

const SYSTEM_PROMPT = `Você é o Copilot do Offer Copilot, um assistente de IA especializado em marketing e copywriting.

Você tem acesso à estrutura do app:
- Dashboard: estatísticas e métricas de uso
- Agentes: configuração de agentes de IA personalizados
- Clientes: gestão de clientes e personas
- Ferramentas: geradores de headlines, VSL, hooks, ofertas, etc.
- API: configuração de provedores (Groq, DeepSeek, Gemini)
- Configurações: parâmetros padrão de IA

Suas capacidades:
1. Explicar funcionalidades do app
2. Sugerir melhorias de prompts e estratégias
3. Orientar sobre como usar as ferramentas
4. Analisar dados e métricas
5. Recomendar melhores práticas de copywriting

Seja conciso, direto e sempre focado em ajudar o usuário a criar ofertas e conteúdos melhores.`;

export function CopilotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Sou seu Copilot. Como posso ajudar você hoje?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const openCopilot = () => setIsOpen(true);
  const closeCopilot = () => setIsOpen(false);
  const toggleCopilot = () => setIsOpen((prev) => !prev);

  const sendMessage = async (content: string, files?: File[]) => {
    // Process files to store metadata
    const fileData = files?.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }));

    const userMessage: Message = {
      role: "user",
      content,
      timestamp: new Date().toISOString(),
      files: fileData,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Get settings and API keys
      const settings = storage.get<AppSettings>(KEYS.SETTINGS);
      const apiKeys = storage.get<Record<string, string>>(KEYS.API_KEYS) || {};
      
      const provider = settings?.defaultProvider || "groq";
      const model = settings?.defaultModel || "llama-3.3-70b-versatile";
      const apiKey = apiKeys[provider];

      if (!apiKey) {
        throw new Error(`Configure a chave de API do ${provider} na página de API`);
      }

      // Prepare content with file info
      let fullContent = content;
      if (fileData && fileData.length > 0) {
        fullContent += `\n\n[Arquivos anexados: ${fileData.map(f => f.name).join(", ")}]`;
      }

      // Prepare messages for AI
      const aiMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map(m => ({ 
          role: m.role, 
          content: m.files ? `${m.content}\n[Arquivos: ${m.files.map(f => f.name).join(", ")}]` : m.content 
        })),
        { role: "user", content: fullContent },
      ];

      // Call AI
      const response = await runAI(
        provider as any,
        apiKey,
        model,
        aiMessages as any
      );

      const assistantMessage: Message = {
        role: "assistant",
        content: response.text,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: `Erro: ${error instanceof Error ? error.message : "Algo deu errado"}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearMessages = () => {
    setMessages([
      {
        role: "assistant",
        content: "Olá! Sou seu Copilot. Como posso ajudar você hoje?",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <CopilotContext.Provider
      value={{
        isOpen,
        messages,
        isProcessing,
        openCopilot,
        closeCopilot,
        toggleCopilot,
        sendMessage,
        clearMessages,
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
}

export function useCopilot() {
  const context = useContext(CopilotContext);
  if (!context) {
    throw new Error("useCopilot must be used within CopilotProvider");
  }
  return context;
}
