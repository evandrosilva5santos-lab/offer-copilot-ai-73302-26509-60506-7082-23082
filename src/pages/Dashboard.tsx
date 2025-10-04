import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Zap, TrendingUp, Clock, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { storage, KEYS } from "@/lib/storage";
import type { ToolExecution, DashboardStats } from "@/types";
import { useAdminMode } from "@/hooks/useAdminMode";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalExecutions: 0,
    totalTokens: 0,
    topTools: [],
    recentExecutions: [],
  });
  const { isAdmin } = useAdminMode();
  const navigate = useNavigate();

  useEffect(() => {
    const executions = storage.get<ToolExecution[]>(KEYS.EXECUTIONS) || [];
    
    const totalTokens = executions.reduce((sum, ex) => sum + (ex.tokens || 0), 0);
    
    const toolCounts: Record<string, number> = {};
    executions.forEach(ex => {
      toolCounts[ex.toolName] = (toolCounts[ex.toolName] || 0) + 1;
    });
    
    const topTools = Object.entries(toolCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const recentExecutions = executions
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    setStats({
      totalExecutions: executions.length,
      totalTokens,
      topTools,
      recentExecutions,
    });
  }, []);

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das suas execuções e ferramentas
        </p>
      </div>

      {!isAdmin && (
        <Alert className="border-primary/50 bg-primary/5">
          <Shield className="h-4 w-4 text-primary" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Modo Administrador Disponível</p>
                <p className="text-sm text-muted-foreground">
                  Pressione <kbd className="px-2 py-1 text-xs bg-muted rounded">Ctrl+Alt+A</kbd> (ou <kbd className="px-2 py-1 text-xs bg-muted rounded">⌘+Option+A</kbd> no Mac) para ativar o painel admin
                </p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {isAdmin && (
        <Alert className="border-destructive/50 bg-destructive/5">
          <Shield className="h-4 w-4 text-destructive" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-destructive">Modo Admin Ativo</p>
                <p className="text-sm text-muted-foreground">
                  Você tem acesso total ao sistema
                </p>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => navigate('/admin/dashboard')}
              >
                Ir para Admin Panel
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Execuções
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExecutions}</div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tokens Consumidos
            </CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTokens.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ferramenta Mais Usada
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.topTools[0]?.name || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.topTools[0]?.count || 0} execuções
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Última Execução
            </CardTitle>
            <Clock className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {stats.recentExecutions[0]
                ? new Date(stats.recentExecutions[0].timestamp).toLocaleString('pt-BR')
                : "Nenhuma"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Ferramentas</CardTitle>
            <CardDescription>Mais executadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topTools.length > 0 ? (
                stats.topTools.map((tool, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{tool.name}</span>
                    <span className="text-sm text-muted-foreground">{tool.count}x</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma execução ainda</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Execuções Recentes</CardTitle>
            <CardDescription>Últimos 5 outputs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentExecutions.length > 0 ? (
                stats.recentExecutions.map((exec) => (
                  <div key={exec.id} className="border-l-2 border-primary pl-3">
                    <p className="text-sm font-medium">{exec.toolName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(exec.timestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma execução ainda</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
