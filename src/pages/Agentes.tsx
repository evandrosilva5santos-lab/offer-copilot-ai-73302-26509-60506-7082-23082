import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { storage, KEYS } from "@/lib/storage";
import type { Agent } from "@/types";
import { toast } from "sonner";

export default function Agentes() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = () => {
    const saved = storage.get<Agent[]>(KEYS.AGENTS) || [];
    setAgents(saved);
  };

  const saveAgent = (agent: Partial<Agent>) => {
    const now = new Date().toISOString();
    let updated: Agent[];

    if (editingAgent) {
      updated = agents.map(a => 
        a.id === editingAgent.id 
          ? { ...a, ...agent, updatedAt: now }
          : a
      );
      toast.success("Agente atualizado!");
    } else {
      const newAgent: Agent = {
        id: crypto.randomUUID(),
        name: agent.name || '',
        model: agent.model || 'llama-3.3-70b-versatile',
        temperature: agent.temperature || 0.7,
        promptBase: agent.promptBase || '',
        createdAt: now,
        updatedAt: now,
      };
      updated = [...agents, newAgent];
      toast.success("Agente criado!");
    }

    storage.set(KEYS.AGENTS, updated);
    setAgents(updated);
    setIsDialogOpen(false);
    setEditingAgent(null);
  };

  const deleteAgent = (id: string) => {
    const updated = agents.filter(a => a.id !== id);
    storage.set(KEYS.AGENTS, updated);
    setAgents(updated);
    toast.success("Agente removido!");
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agentes</h1>
          <p className="text-muted-foreground">
            Gerencie seus agentes de IA
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary" onClick={() => setEditingAgent(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Agente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAgent ? "Editar Agente" : "Novo Agente"}
              </DialogTitle>
            </DialogHeader>
            <AgentForm agent={editingAgent} onSave={saveAgent} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id} className="hover-scale">
            <CardHeader>
              <CardTitle>{agent.name}</CardTitle>
              <CardDescription>Modelo: {agent.model}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Temperatura:</strong> {agent.temperature}</p>
                <p className="line-clamp-2 text-muted-foreground">{agent.promptBase}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingAgent(agent);
                    setIsDialogOpen(true);
                  }}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteAgent(agent.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AgentForm({ agent, onSave }: { agent: Agent | null; onSave: (agent: Partial<Agent>) => void }) {
  const [formData, setFormData] = useState({
    name: agent?.name || '',
    model: agent?.model || 'llama-3.3-70b-versatile',
    temperature: agent?.temperature || 0.7,
    promptBase: agent?.promptBase || '',
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(formData);
      }}
    >
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Meu Agente"
          required
        />
      </div>
      <div>
        <Label htmlFor="model">Modelo</Label>
        <Input
          id="model"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
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
          value={formData.temperature}
          onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
        />
      </div>
      <div>
        <Label htmlFor="promptBase">Prompt Base</Label>
        <Textarea
          id="promptBase"
          value={formData.promptBase}
          onChange={(e) => setFormData({ ...formData, promptBase: e.target.value })}
          placeholder="Você é um assistente..."
          rows={4}
        />
      </div>
      <Button type="submit" className="w-full">Salvar</Button>
    </form>
  );
}
