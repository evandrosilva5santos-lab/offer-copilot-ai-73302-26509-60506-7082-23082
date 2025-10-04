import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CommandMenu } from "@/components/CommandMenu";
import { AdminModeToggle } from "@/components/AdminModeToggle";
import { useAdminMode } from "@/hooks/useAdminMode";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAdmin, toggle } = useAdminMode();
  const { toast } = useToast();

  useEffect(() => {
    // Listen for admin mode toggle globally
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'a') {
        const newStatus = toggle();
        toast({
          title: newStatus ? "Modo Admin Ativado" : "Modo Admin Desativado",
          description: newStatus 
            ? "Você agora tem acesso ao painel administrativo" 
            : "Modo admin desativado",
          variant: newStatus ? "destructive" : "default",
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggle, toast]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b bg-card flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              {isAdmin && (
                <Badge variant="destructive" className="gap-1">
                  <Shield className="h-3 w-3" />
                  Admin Mode
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <CommandMenu />
              <AdminModeToggle />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
