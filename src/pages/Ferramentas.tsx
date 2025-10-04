import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllTools, getIconComponent, initializeTools } from "@/lib/toolsRegistry";
import type { ToolDefinition } from "@/types";

export default function Ferramentas() {
  const navigate = useNavigate();
  const [tools, setTools] = useState<ToolDefinition[]>([]);

  useEffect(() => {
    // Initialize tools on first load and reload whenever returning to this page
    const loadedTools = initializeTools();
    setTools(loadedTools);
    
    // Listen for storage changes to update in real-time
    const handleStorageChange = () => {
      setTools(getAllTools());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    window.addEventListener('toolsUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('toolsUpdated', handleStorageChange);
    };
  }, []);

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ferramentas</h1>
        <p className="text-muted-foreground">
          Escolha uma ferramenta para começar
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool) => {
          const Icon = getIconComponent(tool.icon);
          return (
            <Card 
              key={tool.id} 
              className="hover-scale cursor-pointer" 
              onClick={() => navigate(`/ferramentas/${tool.id}`)}
            >
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{tool.name}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Abrir
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
