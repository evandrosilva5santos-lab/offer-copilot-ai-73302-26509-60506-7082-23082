import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { storage, KEYS } from "@/lib/storage";
import type { Client } from "@/types";
import { toast } from "sonner";

export default function Clientes() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    const saved = storage.get<Client[]>(KEYS.CLIENTS) || [];
    setClients(saved);
  };

  const saveClient = (client: Partial<Client>) => {
    const now = new Date().toISOString();
    let updated: Client[];

    if (editingClient) {
      updated = clients.map(c => 
        c.id === editingClient.id 
          ? { ...c, ...client, updatedAt: now }
          : c
      );
      toast.success("Cliente atualizado!");
    } else {
      const newClient: Client = {
        id: crypto.randomUUID(),
        name: client.name || '',
        segment: client.segment || '',
        persona: client.persona || '',
        notes: client.notes || '',
        voiceTone: client.voiceTone || '',
        objectives: client.objectives || [],
        createdAt: now,
        updatedAt: now,
      };
      updated = [...clients, newClient];
      toast.success("Cliente criado!");
    }

    storage.set(KEYS.CLIENTS, updated);
    setClients(updated);
    setIsDialogOpen(false);
    setEditingClient(null);
  };

  const deleteClient = (id: string) => {
    const updated = clients.filter(c => c.id !== id);
    storage.set(KEYS.CLIENTS, updated);
    setClients(updated);
    toast.success("Cliente removido!");
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie seus clientes e personas
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary" onClick={() => setEditingClient(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? "Editar Cliente" : "Novo Cliente"}
              </DialogTitle>
            </DialogHeader>
            <ClientForm client={editingClient} onSave={saveClient} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <Card key={client.id} className="hover-scale">
            <CardHeader>
              <CardTitle>{client.name}</CardTitle>
              <CardDescription>{client.segment}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Persona:</strong> {client.persona}</p>
                <p><strong>Tom:</strong> {client.voiceTone}</p>
                <p className="line-clamp-2 text-muted-foreground">{client.notes}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingClient(client);
                    setIsDialogOpen(true);
                  }}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteClient(client.id)}
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

function ClientForm({ client, onSave }: { client: Client | null; onSave: (client: Partial<Client>) => void }) {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    segment: client?.segment || '',
    persona: client?.persona || '',
    notes: client?.notes || '',
    voiceTone: client?.voiceTone || '',
    objectives: client?.objectives?.join(', ') || '',
  });

  return (
    <form
      className="space-y-4 max-h-[60vh] overflow-y-auto"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          ...formData,
          objectives: formData.objectives.split(',').map(s => s.trim()).filter(Boolean),
        });
      }}
    >
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nome do cliente"
          required
        />
      </div>
      <div>
        <Label htmlFor="segment">Segmento</Label>
        <Input
          id="segment"
          value={formData.segment}
          onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
          placeholder="Ex: E-commerce, SaaS"
        />
      </div>
      <div>
        <Label htmlFor="persona">Persona</Label>
        <Input
          id="persona"
          value={formData.persona}
          onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
          placeholder="Ex: Empreendedor digital"
        />
      </div>
      <div>
        <Label htmlFor="voiceTone">Tom de Voz</Label>
        <Input
          id="voiceTone"
          value={formData.voiceTone}
          onChange={(e) => setFormData({ ...formData, voiceTone: e.target.value })}
          placeholder="Ex: Casual, profissional"
        />
      </div>
      <div>
        <Label htmlFor="objectives">Objetivos (separados por vírgula)</Label>
        <Input
          id="objectives"
          value={formData.objectives}
          onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
          placeholder="Aumentar vendas, gerar leads"
        />
      </div>
      <div>
        <Label htmlFor="notes">Notas</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Anotações sobre o cliente..."
          rows={4}
        />
      </div>
      <Button type="submit" className="w-full">Salvar</Button>
    </form>
  );
}
