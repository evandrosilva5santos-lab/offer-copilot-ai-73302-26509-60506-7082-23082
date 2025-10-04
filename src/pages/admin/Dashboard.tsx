import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Users, Activity, TrendingUp } from "lucide-react";
import { getAllTools, getAllCategories } from "@/lib/toolsRegistry";
import { storage, KEYS } from "@/lib/storage";
import type { ToolExecution } from "@/types";
import { AdminLayout } from "./AdminLayout";

export default function AdminDashboard() {
  const tools = getAllTools();
  const categories = getAllCategories();
  const executions = storage.get<ToolExecution[]>(KEYS.EXECUTIONS) || [];
  
  const stats = {
    totalTools: tools.length,
    totalCategories: categories.length,
    totalExecutions: executions.length,
    activeUsers: 3, // Mock
  };

  const recentActivity = executions
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema e atividades
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Ferramentas
              </CardTitle>
              <Wrench className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTools}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalCategories} categorias
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Usuários Ativos
              </CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                últimas 24h
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Execuções Totais
              </CardTitle>
              <Activity className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalExecutions}</div>
              <p className="text-xs text-muted-foreground">
                todas as ferramentas
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Uso
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalTools > 0 ? Math.round(stats.totalExecutions / stats.totalTools) : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                execuções/ferramenta
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ferramentas por Categoria</CardTitle>
              <CardDescription>Distribuição das ferramentas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.map((cat) => {
                  const count = tools.filter(t => t.category === cat).length;
                  return (
                    <div key={cat} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{cat}</span>
                      <span className="text-sm text-muted-foreground">{count} ferramentas</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Últimas execuções no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((exec) => (
                    <div key={exec.id} className="border-l-2 border-primary pl-3">
                      <p className="text-sm font-medium">{exec.toolName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(exec.timestamp).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma atividade registrada</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
