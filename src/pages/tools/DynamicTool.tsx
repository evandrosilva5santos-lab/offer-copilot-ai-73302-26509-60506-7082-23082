import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { getToolById, getIconComponent } from "@/lib/toolsRegistry";
import { useToast } from "@/hooks/use-toast";
import type { ToolDefinition } from "@/types";

export default function DynamicTool() {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tool, setTool] = useState<ToolDefinition | null>(null);
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!toolId) return;
    const loadedTool = getToolById(toolId);
    
    if (!loadedTool) {
      toast({
        title: "Ferramenta não encontrada",
        description: "Esta ferramenta não existe ou foi removida.",
        variant: "destructive",
      });
      navigate("/ferramentas");
      return;
    }
    
    setTool(loadedTool);
    
    // Initialize inputs
    const initialInputs: Record<string, any> = {};
    loadedTool.inputs.forEach((input) => {
      initialInputs[input.id] = input.type === "number" ? 0 : "";
    });
    setInputs(initialInputs);
  }, [toolId, navigate, toast]);

  const handleGenerate = async () => {
    if (!tool) return;

    // Validate required fields
    const missingFields = tool.inputs
      .filter((input) => input.required && !inputs[input.id])
      .map((input) => input.label);

    if (missingFields.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: `Preencha: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setOutput("");

    try {
      // Check if this is a research tool that needs context pipeline
      const isResearchTool = tool.id === 'publico' || tool.id === 'persona';
      
      let finalResponse = "";
      
      if (isResearchTool) {
        // Import context pipeline dynamically
        const { buildContext } = await import('@/lib/contextPipeline');
        const { runAI } = await import('@/lib/aiAdapters');
        const { storage, KEYS } = await import('@/lib/storage');
        
        // Build query from inputs
        const query = Object.values(inputs).join(' ');
        
        // Build rich context through pipeline
        const context = await buildContext(query);
        
        // Get API keys
        const apiKeys = storage.get<Record<string, string>>(KEYS.API_KEYS) || {};
        const groqKey = apiKeys['groq'];
        
        if (!groqKey) {
          toast({
            title: "API Key não configurada",
            description: "Configure sua chave Groq em Configurações > API",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        // Generate response with context
        const aiResponse = await runAI('groq', groqKey, 'llama-3.3-70b-versatile', [
          {
            role: 'system',
            content: `${tool.prompt}\n\nVocê tem acesso ao seguinte contexto de pesquisa profunda:\n\n${context}\n\nUse essas informações para gerar uma análise completa e aprofundada.`
          },
          {
            role: 'user',
            content: `Inputs:\n${Object.entries(inputs).map(([key, value]) => `${key}: ${value}`).join('\n')}`
          }
        ]);
        
        finalResponse = aiResponse.text;
      } else {
        // Regular tool - use mock response
        if (tool.outputType === "list") {
          finalResponse = "1. Resultado exemplo 1\n2. Resultado exemplo 2\n3. Resultado exemplo 3\n4. Resultado exemplo 4\n5. Resultado exemplo 5";
        } else if (tool.outputType === "json") {
          finalResponse = JSON.stringify({
            resultado: "Exemplo de resposta estruturada",
            dados: inputs,
            gerado_em: new Date().toISOString(),
          }, null, 2);
        } else {
          finalResponse = `Resultado gerado para ${tool.name}:\n\nBaseado nos inputs fornecidos, aqui está uma resposta personalizada que demonstra a funcionalidade da ferramenta.\n\nInputs recebidos:\n${Object.entries(inputs)
            .map(([key, value]) => `- ${key}: ${value}`)
            .join("\n")}`;
        }
      }

      setOutput(finalResponse);
      
      toast({
        title: "Sucesso",
        description: "Conteúdo gerado com sucesso!",
      });
    } catch (error) {
      console.error('Tool generation error:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao gerar conteúdo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!tool) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const Icon = getIconComponent(tool.icon);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/ferramentas")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{tool.name}</h1>
            <p className="text-muted-foreground">{tool.description}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Parâmetros</CardTitle>
            <CardDescription>
              Preencha os dados para gerar o conteúdo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tool.inputs.map((input) => (
              <div key={input.id} className="space-y-2">
                <Label htmlFor={input.id}>
                  {input.label}
                  {input.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                
                {input.type === "text" && (
                  <Input
                    id={input.id}
                    placeholder={input.placeholder}
                    value={inputs[input.id] || ""}
                    onChange={(e) =>
                      setInputs({ ...inputs, [input.id]: e.target.value })
                    }
                  />
                )}
                
                {input.type === "textarea" && (
                  <Textarea
                    id={input.id}
                    placeholder={input.placeholder}
                    value={inputs[input.id] || ""}
                    onChange={(e) =>
                      setInputs({ ...inputs, [input.id]: e.target.value })
                    }
                    rows={4}
                  />
                )}
                
                {input.type === "number" && (
                  <Input
                    id={input.id}
                    type="number"
                    placeholder={input.placeholder}
                    value={inputs[input.id] || 0}
                    onChange={(e) =>
                      setInputs({ ...inputs, [input.id]: parseFloat(e.target.value) || 0 })
                    }
                  />
                )}
                
                {input.type === "select" && input.options && (
                  <Select
                    value={inputs[input.id] || ""}
                    onValueChange={(value) =>
                      setInputs({ ...inputs, [input.id]: value })
                    }
                  >
                    <SelectTrigger id={input.id}>
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      {input.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}

            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar Conteúdo
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
            <CardDescription>
              Conteúdo gerado pela IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            {output ? (
              <div className="space-y-4">
                <pre className="whitespace-pre-wrap p-4 rounded-lg bg-muted text-sm">
                  {output}
                </pre>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(output);
                    toast({
                      title: "Copiado!",
                      description: "Conteúdo copiado para a área de transferência.",
                    });
                  }}
                  className="w-full"
                >
                  Copiar para Área de Transferência
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Preencha os parâmetros e clique em "Gerar Conteúdo" para ver o resultado aqui
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
