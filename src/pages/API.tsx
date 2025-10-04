import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Check, AlertCircle, ExternalLink } from "lucide-react";
import { storage, KEYS } from "@/lib/storage";
import type { AIProvider } from "@/types";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface ProviderInfo extends AIProvider {
  description: string;
  docsUrl?: string;
}

const providers: ProviderInfo[] = [
  {
    id: "groq",
    name: "Groq",
    apiKey: "",
    isActive: true,
    isFree: true,
    baseUrl: "https://api.groq.com/openai/v1",
    description: "Inferência ultra-rápida com modelos open-source",
    docsUrl: "https://console.groq.com/keys",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    apiKey: "",
    isActive: true,
    isFree: true,
    baseUrl: "https://api.deepseek.com/v1",
    description: "Modelos de alta qualidade com foco em raciocínio",
    docsUrl: "https://platform.deepseek.com/api_keys",
  },
  {
    id: "gemini",
    name: "Gemini",
    apiKey: "",
    isActive: true,
    isFree: true,
    baseUrl: "https://generativelanguage.googleapis.com",
    description: "Google AI com suporte multimodal avançado",
    docsUrl: "https://aistudio.google.com/apikey",
  },
  {
    id: "openai",
    name: "OpenAI",
    apiKey: "",
    isActive: true,
    isFree: false,
    baseUrl: "https://api.openai.com/v1",
    description: "GPT-4 e outros modelos avançados (pago)",
    docsUrl: "https://platform.openai.com/api-keys",
  },
  {
    id: "claude",
    name: "Claude (Anthropic)",
    apiKey: "",
    isActive: true,
    isFree: false,
    baseUrl: "https://api.anthropic.com/v1",
    description: "Modelos Claude 3.5 e 4 (pago)",
    docsUrl: "https://console.anthropic.com/settings/keys",
  },
];

export default function API() {
  const [keys, setKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = storage.get<Record<string, string>>(KEYS.API_KEYS) || {};
    setKeys(saved);
  }, []);

  const saveKey = (providerId: string, key: string) => {
    const updated = { ...keys, [providerId]: key };
    storage.set(KEYS.API_KEYS, updated);
    setKeys(updated);
    toast.success("Chave salva!");
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 animate-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrações de API</h1>
          <p className="text-muted-foreground">
            Configure suas chaves de API dos provedores de IA gratuitos
          </p>
        </div>

        {/* Info Card - Why personal API keys? */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Por que preciso configurar minhas próprias chaves?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Groq, DeepSeek e Gemini são 100% gratuitos</strong>, mas cada usuário precisa de sua própria chave de API por estes motivos:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                <li>
                  <strong>Rate Limits:</strong> Uma chave compartilhada seria esgotada em minutos por múltiplos usuários
                </li>
                <li>
                  <strong>Segurança:</strong> Chaves públicas podem ser bloqueadas ou abusadas
                </li>
                <li>
                  <strong>Controle:</strong> Você tem total controle sobre seu uso e limites
                </li>
              </ul>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-background rounded-lg border">
              <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">É rápido e fácil!</p>
                <p className="text-xs text-muted-foreground">
                  Leva menos de 2 minutos para criar uma conta e obter sua chave. 
                  <strong> Sem cartão de crédito necessário.</strong> Clique no ícone 🔗 ao lado de cada provedor para obter sua chave gratuitamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {providers.map((provider) => (
            <Card 
              key={provider.id} 
              className={!provider.isFree ? "opacity-60 border-dashed" : "hover-scale"}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {provider.name}
                    {provider.isFree && (
                      <Badge variant="secondary" className="text-xs">
                        Grátis
                      </Badge>
                    )}
                  </div>
                  {!provider.isFree ? (
                    <Tooltip>
                      <TooltipTrigger>
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Disponível com Supabase</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : keys[provider.id] ? (
                    <Tooltip>
                      <TooltipTrigger>
                        <Check className="h-4 w-4 text-accent" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Chave configurada</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Chave não configurada</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </CardTitle>
                <CardDescription className="flex items-start gap-2">
                  <span className="flex-1">{provider.description}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {!provider.isFree && (
                    <div className="p-3 bg-muted rounded-md border border-dashed">
                      <p className="text-xs text-muted-foreground">
                        ⚠️ Este provedor é pago. Você precisa ter sua própria chave de API.
                      </p>
                    </div>
                  )}
                  <div>
                    <Label htmlFor={`key-${provider.id}`}>API Key</Label>
                    <Input
                      id={`key-${provider.id}`}
                      type="password"
                      placeholder="Sua chave de API..."
                      value={keys[provider.id] || ""}
                      onChange={(e) => setKeys({ ...keys, [provider.id]: e.target.value })}
                    />
                  </div>
                  {provider.baseUrl && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Base URL: {provider.baseUrl}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => saveKey(provider.id, keys[provider.id] || "")}
                      className="flex-1"
                    >
                      Salvar Chave
                    </Button>
                    {provider.docsUrl && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => window.open(provider.docsUrl, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Obter chave de API</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
