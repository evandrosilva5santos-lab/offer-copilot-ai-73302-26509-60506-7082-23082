import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAdminSettings, saveAdminSettings, AdminSettings } from "@/lib/adminStorage";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "./AdminLayout";
import { useEnvironment } from "@/lib/envManager";
import { loadPipelineConfig, savePipelineConfig, type PipelineConfig } from "@/lib/contextPipeline";
import { Search, Sparkles, Palette } from "lucide-react";
import { useTheme, type Theme } from "@/hooks/useTheme";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>(getAdminSettings());
  const [pipelineConfig, setPipelineConfig] = useState<PipelineConfig>(loadPipelineConfig());
  const { toast } = useToast();
  const env = useEnvironment();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setPipelineConfig(loadPipelineConfig());
  }, []);

  const handleSave = () => {
    saveAdminSettings(settings);
    savePipelineConfig(pipelineConfig);
    toast({
      title: "Configurações salvas",
      description: "As configurações foram atualizadas com sucesso.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações Admin</h1>
          <p className="text-muted-foreground">
            Configure preferências do sistema
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preferências do Sistema</CardTitle>
            <CardDescription>
              Configurações globais que afetam todos os usuários
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="theme">Tema Padrão</Label>
              <Select
                value={settings.theme}
                onValueChange={(value) =>
                  setSettings({ ...settings, theme: value as AdminSettings['theme'] })
                }
              >
                <SelectTrigger id="theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">Provedor IA Padrão</Label>
              <Select
                value={settings.defaultProvider}
                onValueChange={(value) =>
                  setSettings({ ...settings, defaultProvider: value })
                }
              >
                <SelectTrigger id="provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="groq">Groq</SelectItem>
                  <SelectItem value="deepseek">DeepSeek</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modelo Padrão</Label>
              <Select
                value={settings.defaultModel}
                onValueChange={(value) =>
                  setSettings({ ...settings, defaultModel: value })
                }
              >
                <SelectTrigger id="model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llama-3.1-70b-versatile">Llama 3.1 70B</SelectItem>
                  <SelectItem value="deepseek-chat">DeepSeek Chat</SelectItem>
                  <SelectItem value="gemini-2.0-flash-exp">Gemini 2.0 Flash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autosave">Auto-save</Label>
                <p className="text-sm text-muted-foreground">
                  Salvar automaticamente alterações
                </p>
              </div>
              <Switch
                id="autosave"
                checked={settings.autoSave}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoSave: checked })
                }
              />
            </div>

            <Button onClick={handleSave} className="w-full">
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>

        {/* Visual Theme Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Tema Visual</CardTitle>
                <CardDescription>
                  Escolha o estilo visual do aplicativo
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="visual-theme">Tema Ativo</Label>
              <Select
                value={theme}
                onValueChange={(value) => setTheme(value as Theme)}
              >
                <SelectTrigger id="visual-theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Padrão (Clássico)</SelectItem>
                  <SelectItem value="seo-dark">SEO Dark (Cyber Luxury)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                O tema SEO Dark oferece visual premium com gradientes azuis e ciano
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="text-sm font-medium mb-2">Tema Padrão</p>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded bg-primary"></div>
                  <div className="w-8 h-8 rounded bg-secondary"></div>
                  <div className="w-8 h-8 rounded bg-accent"></div>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-primary/20 bg-gradient-to-br from-seo-blue/10 to-seo-cyan/10">
                <p className="text-sm font-medium mb-2">SEO Dark</p>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded" style={{ background: 'hsl(199, 89%, 48%)' }}></div>
                  <div className="w-8 h-8 rounded" style={{ background: 'hsl(188, 94%, 43%)' }}></div>
                  <div className="w-8 h-8 rounded" style={{ background: 'hsl(192, 100%, 50%)' }}></div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Compatibilidade Universal</p>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 pl-6 list-disc">
                <li>Totalmente responsivo para mobile, tablet e desktop</li>
                <li>Compatível com Lovable, Dyad e V0.dev</li>
                <li>Usa apenas Tailwind CSS + variáveis nativas</li>
                <li>Animações suaves e efeitos hover premium</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Context Pipeline Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Context Pipeline</CardTitle>
                <CardDescription>
                  Sistema de pesquisa profunda automatizada para ferramentas de pesquisa
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>DeepSeek AI</Label>
                  <p className="text-sm text-muted-foreground">
                    Pesquisa ampla com raciocínio de IA
                  </p>
                </div>
                <Switch
                  checked={pipelineConfig.enableDeepSeek}
                  onCheckedChange={(checked) =>
                    setPipelineConfig({ ...pipelineConfig, enableDeepSeek: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tavily Search</Label>
                  <p className="text-sm text-muted-foreground">
                    Busca semântica com dados em tempo real
                  </p>
                </div>
                <Switch
                  checked={pipelineConfig.enableTavily}
                  onCheckedChange={(checked) =>
                    setPipelineConfig({ ...pipelineConfig, enableTavily: checked })
                  }
                />
              </div>

              {pipelineConfig.enableTavily && (
                <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                  <Label htmlFor="tavily-key">Tavily API Key</Label>
                  <Input
                    id="tavily-key"
                    type="password"
                    placeholder="tvly-••••••••••••••••"
                    value={pipelineConfig.tavilyApiKey || ''}
                    onChange={(e) =>
                      setPipelineConfig({ ...pipelineConfig, tavilyApiKey: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Obtenha sua chave em{' '}
                    <a
                      href="https://tavily.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      tavily.com
                    </a>
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Jina Reader</Label>
                  <p className="text-sm text-muted-foreground">
                    Leitura profunda de artigos (requer Tavily)
                  </p>
                </div>
                <Switch
                  checked={pipelineConfig.enableJina}
                  onCheckedChange={(checked) =>
                    setPipelineConfig({ ...pipelineConfig, enableJina: checked })
                  }
                  disabled={!pipelineConfig.enableTavily}
                />
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Como funciona?</p>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 pl-6 list-disc">
                <li>O pipeline coleta contexto de múltiplas fontes automaticamente</li>
                <li>Consolida os dados e entrega à IA para gerar respostas mais completas</li>
                <li>Funciona nas ferramentas: Pesquisa de Público e Pesquisa de Persona</li>
                <li>O usuário vê apenas o resultado final, não os dados brutos</li>
              </ul>
            </div>

            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
              <p className="text-xs text-yellow-700 dark:text-yellow-400">
                💡 <strong>TODO:</strong> Migrar para Edge Function quando Supabase estiver ativo para melhor performance e segurança
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Ambiente</CardTitle>
            <CardDescription>
              Configuração atual de execução
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ambiente</Label>
                <p className="text-sm font-mono mt-1">{env.displayName}</p>
              </div>
              <div>
                <Label>API Base URL</Label>
                <p className="text-sm font-mono text-muted-foreground truncate mt-1">
                  {env.apiBaseUrl}
                </p>
              </div>
            </div>
            
            <div>
              <Label>Features Habilitadas</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {Object.entries(env.features).map(([key, enabled]) => (
                  <Badge key={key} variant={enabled ? "default" : "secondary"}>
                    {key}: {enabled ? "✓" : "✗"}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="p-3 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground">
                💡 O ambiente é detectado automaticamente. Para override manual, 
                configure VITE_APP_ENV no arquivo .env.local
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
