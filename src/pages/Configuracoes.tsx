import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { storage, KEYS } from "@/lib/storage";
import type { AppSettings } from "@/types";
import { toast } from "sonner";
import { EnvironmentBadge } from "@/components/EnvironmentBadge";
import { Shield, Key, Sparkles } from "lucide-react";

const defaultSettings: AppSettings = {
  theme: "dark",
  defaultModel: "llama-3.3-70b-versatile",
  defaultTemperature: 0.7,
  maxTokens: 2000,
  defaultProvider: "groq",
};

export default function Configuracoes() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [useCompanyApi, setUseCompanyApi] = useState(true);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = storage.get<AppSettings>(KEYS.SETTINGS) || defaultSettings;
    setSettings(saved);
    
    const savedApiKeys = storage.get<Record<string, string>>(KEYS.API_KEYS) || {};
    setApiKeys(savedApiKeys);
    
    const savedUseCompanyApi = storage.get<boolean>('offer-copilot-use-company-api');
    if (savedUseCompanyApi !== null) {
      setUseCompanyApi(savedUseCompanyApi);
    }
  }, []);

  const saveSettings = () => {
    storage.set(KEYS.SETTINGS, settings);
    storage.set(KEYS.API_KEYS, apiKeys);
    storage.set('offer-copilot-use-company-api', useCompanyApi);
    toast.success("Configurações salvas!");
  };

  const updateApiKey = (provider: string, key: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: key }));
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Personalize os parâmetros padrão do app
          </p>
        </div>
        <EnvironmentBadge />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parâmetros da IA</CardTitle>
          <CardDescription>
            Configure os valores padrão para execuções de IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="provider">Provedor Padrão</Label>
            <Select
              value={settings.defaultProvider}
              onValueChange={(value) => setSettings({ ...settings, defaultProvider: value })}
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

          <div>
            <Label htmlFor="model">Modelo Padrão</Label>
            <Input
              id="model"
              value={settings.defaultModel}
              onChange={(e) => setSettings({ ...settings, defaultModel: e.target.value })}
              placeholder="llama-3.3-70b-versatile"
            />
          </div>

          <div>
            <Label htmlFor="temperature">Temperatura</Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              min="0"
              max="2"
              value={settings.defaultTemperature}
              onChange={(e) => setSettings({ ...settings, defaultTemperature: parseFloat(e.target.value) })}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              0 = mais determinístico, 2 = mais criativo
            </p>
          </div>

          <div>
            <Label htmlFor="maxTokens">Max Tokens</Label>
            <Input
              id="maxTokens"
              type="number"
              value={settings.maxTokens}
              onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
            />
          </div>

          <Button onClick={saveSettings} className="w-full">
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      {/* API Keys Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <CardTitle>Chaves de API</CardTitle>
              <CardDescription>
                Configure o acesso aos provedores de IA
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company API Toggle */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <Label htmlFor="use-company-api" className="text-base font-semibold">
                    Usar API da Empresa (Grátis)
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Utilize nossa API compartilhada para testes e uso gratuito. Perfeito para começar sem precisar de chave própria.
                </p>
              </div>
              <Switch
                id="use-company-api"
                checked={useCompanyApi}
                onCheckedChange={setUseCompanyApi}
              />
            </div>
          </div>

          {useCompanyApi ? (
            <div className="p-4 rounded-lg bg-muted space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">API da Empresa Ativada</p>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 pl-6 list-disc">
                <li>Acesso gratuito e ilimitado para todos os provedores</li>
                <li>Groq: Modelos Llama 3.3 e Mixtral disponíveis</li>
                <li>DeepSeek: Acesso completo ao DeepSeek-Chat</li>
                <li>Gemini: Modelos Flash e Pro habilitados</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                💡 <strong>Dica:</strong> Desative esta opção se quiser usar suas próprias chaves de API com limites personalizados.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Groq API Key */}
              <div className="space-y-2">
                <Label htmlFor="groq-api-key">
                  Groq API Key
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    (Obtenha em{" "}
                    <a
                      href="https://console.groq.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-primary"
                    >
                      console.groq.com
                    </a>
                    )
                  </span>
                </Label>
                <Input
                  id="groq-api-key"
                  type="password"
                  placeholder="gsk_••••••••••••••••••••••••••••••••••••••••"
                  value={apiKeys.groq || ""}
                  onChange={(e) => updateApiKey("groq", e.target.value)}
                />
              </div>

              {/* DeepSeek API Key */}
              <div className="space-y-2">
                <Label htmlFor="deepseek-api-key">
                  DeepSeek API Key
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    (Obtenha em{" "}
                    <a
                      href="https://platform.deepseek.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-primary"
                    >
                      platform.deepseek.com
                    </a>
                    )
                  </span>
                </Label>
                <Input
                  id="deepseek-api-key"
                  type="password"
                  placeholder="sk-••••••••••••••••••••••••••••••••••••••••"
                  value={apiKeys.deepseek || ""}
                  onChange={(e) => updateApiKey("deepseek", e.target.value)}
                />
              </div>

              {/* Gemini API Key */}
              <div className="space-y-2">
                <Label htmlFor="gemini-api-key">
                  Gemini API Key
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    (Obtenha em{" "}
                    <a
                      href="https://makersuite.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-primary"
                    >
                      Google AI Studio
                    </a>
                    )
                  </span>
                </Label>
                <Input
                  id="gemini-api-key"
                  type="password"
                  placeholder="AIza••••••••••••••••••••••••••••••••••••"
                  value={apiKeys.gemini || ""}
                  onChange={(e) => updateApiKey("gemini", e.target.value)}
                />
              </div>

              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                  ⚠️ <strong>Aviso de Segurança:</strong> Suas chaves são armazenadas localmente no navegador. Nunca compartilhe suas chaves de API.
                </p>
              </div>
            </div>
          )}

          <Button onClick={saveSettings} className="w-full" size="lg">
            <Key className="mr-2 h-4 w-4" />
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
