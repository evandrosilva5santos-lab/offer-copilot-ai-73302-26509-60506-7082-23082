import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { storage, KEYS } from "@/lib/storage";
import type { AppSettings } from "@/types";
import { toast } from "sonner";
import { EnvironmentBadge } from "@/components/EnvironmentBadge";

const defaultSettings: AppSettings = {
  theme: "dark",
  defaultModel: "llama-3.3-70b-versatile",
  defaultTemperature: 0.7,
  maxTokens: 2000,
  defaultProvider: "groq",
};

export default function Configuracoes() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    const saved = storage.get<AppSettings>(KEYS.SETTINGS) || defaultSettings;
    setSettings(saved);
  }, []);

  const saveSettings = () => {
    storage.set(KEYS.SETTINGS, settings);
    toast.success("Configurações salvas!");
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
    </div>
  );
}
