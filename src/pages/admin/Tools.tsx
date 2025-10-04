import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getAllTools, createTool, updateTool, deleteTool, getIconComponent } from "@/lib/toolsRegistry";
import type { ToolDefinition, ToolInput } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "./AdminLayout";
import { Plus, Edit, Trash2, X } from "lucide-react";

const iconOptions = [
  { value: "lightbulb", label: "Lightbulb" },
  { value: "target", label: "Target" },
  { value: "video", label: "Video" },
  { value: "gift", label: "Gift" },
  { value: "users", label: "Users" },
  { value: "userCheck", label: "UserCheck" },
  { value: "edit", label: "Edit" },
  { value: "anchor", label: "Anchor" },
  { value: "sparkles", label: "Sparkles" },
];

export default function AdminTools() {
  const [tools, setTools] = useState(getAllTools());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<ToolDefinition | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<ToolDefinition>>({
    name: "",
    description: "",
    icon: "sparkles",
    prompt: "",
    inputs: [],
    outputType: "text",
    category: "",
  });

  const [inputForm, setInputForm] = useState<ToolInput>({
    id: "",
    label: "",
    type: "text",
    placeholder: "",
    required: true,
    options: [],
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "sparkles",
      prompt: "",
      inputs: [],
      outputType: "text",
      category: "",
    });
    setInputForm({
      id: "",
      label: "",
      type: "text",
      placeholder: "",
      required: true,
      options: [],
    });
    setEditingTool(null);
  };

  const handleSaveTool = () => {
    if (!formData.name || !formData.description || !formData.prompt) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const toolId = editingTool?.id || formData.name.toLowerCase().replace(/\s+/g, '-');

    if (editingTool) {
      updateTool(editingTool.id, formData as ToolDefinition);
      toast({
        title: "Ferramenta atualizada",
        description: `${formData.name} foi atualizada com sucesso.`,
      });
    } else {
      createTool({ ...formData, id: toolId } as Omit<ToolDefinition, "createdAt" | "updatedAt">);
      toast({
        title: "Ferramenta criada",
        description: `${formData.name} foi criada com sucesso.`,
      });
    }

    setTools(getAllTools());
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEditTool = (tool: ToolDefinition) => {
    setEditingTool(tool);
    setFormData(tool);
    setIsDialogOpen(true);
  };

  const handleDeleteTool = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta ferramenta?")) {
      deleteTool(id);
      setTools(getAllTools());
      toast({
        title: "Ferramenta excluída",
        description: "A ferramenta foi removida com sucesso.",
      });
    }
  };

  const handleAddInput = () => {
    if (!inputForm.label) return;
    
    const newInput: ToolInput = {
      ...inputForm,
      id: inputForm.label.toLowerCase().replace(/\s+/g, '-'),
    };

    setFormData({
      ...formData,
      inputs: [...(formData.inputs || []), newInput],
    });

    setInputForm({
      id: "",
      label: "",
      type: "text",
      placeholder: "",
      required: true,
      options: [],
    });
  };

  const handleRemoveInput = (index: number) => {
    const newInputs = [...(formData.inputs || [])];
    newInputs.splice(index, 1);
    setFormData({ ...formData, inputs: newInputs });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Ferramentas</h1>
            <p className="text-muted-foreground">
              Crie, edite e exclua ferramentas IA
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Ferramenta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTool ? "Editar Ferramenta" : "Criar Nova Ferramenta"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados da ferramenta
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Headline Generator"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Ex: Copywriting"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição curta da ferramenta"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="icon">Ícone</Label>
                    <Select
                      value={formData.icon}
                      onValueChange={(value) => setFormData({ ...formData, icon: value })}
                    >
                      <SelectTrigger id="icon">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outputType">Tipo de Saída</Label>
                    <Select
                      value={formData.outputType}
                      onValueChange={(value: any) => setFormData({ ...formData, outputType: value })}
                    >
                      <SelectTrigger id="outputType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Texto</SelectItem>
                        <SelectItem value="list">Lista</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt Base *</Label>
                  <Textarea
                    id="prompt"
                    value={formData.prompt}
                    onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                    placeholder="Prompt que será usado pela IA..."
                    rows={4}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Campos de Entrada</Label>
                  
                  {(formData.inputs || []).map((input, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{input.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {input.type} {input.required && "- Obrigatório"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveInput(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Card>
                    <CardContent className="pt-4 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Label do campo"
                          value={inputForm.label}
                          onChange={(e) => setInputForm({ ...inputForm, label: e.target.value })}
                        />
                        <Select
                          value={inputForm.type}
                          onValueChange={(value: any) => setInputForm({ ...inputForm, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                        placeholder="Placeholder (opcional)"
                        value={inputForm.placeholder}
                        onChange={(e) => setInputForm({ ...inputForm, placeholder: e.target.value })}
                      />
                      <Button variant="outline" size="sm" onClick={handleAddInput} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Campo
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveTool}>
                  {editingTool ? "Atualizar" : "Criar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = getIconComponent(tool.icon);
            return (
              <Card key={tool.id} className="hover-scale">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        {tool.category && (
                          <Badge variant="secondary" className="mt-1">
                            {tool.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-2">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {tool.inputs.length} campos de entrada
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditTool(tool)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTool(tool.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
