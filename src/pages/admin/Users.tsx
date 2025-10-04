import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getMockUsers } from "@/lib/adminStorage";
import { AdminLayout } from "./AdminLayout";

export default function AdminUsers() {
  const users = getMockUsers();

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Usuários</h1>
          <p className="text-muted-foreground">
            Lista de usuários cadastrados no sistema
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usuários Ativos</CardTitle>
            <CardDescription>
              Total de {users.length} usuários cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{user.toolsUsed} execuções</p>
                      <p className="text-xs text-muted-foreground">
                        Último acesso: {new Date(user.lastActive).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
