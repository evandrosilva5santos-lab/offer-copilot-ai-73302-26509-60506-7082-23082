import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Shield, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b bg-destructive/10 border-destructive/20 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-destructive" />
              <span className="font-semibold text-destructive">Modo Administrador</span>
            </div>
            <ThemeToggle />
          </header>
          
          <main className="flex-1 p-6 overflow-auto">
            <Alert className="mb-6 border-destructive/50 bg-destructive/5">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-sm">
                Você está no painel administrativo. Alterações aqui afetam todos os usuários.
                <span className="ml-2 text-muted-foreground">Pressione Ctrl+Alt+A para sair.</span>
              </AlertDescription>
            </Alert>
            
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
