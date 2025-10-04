import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminMode } from "@/hooks/useAdminMode";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function AdminModeToggle() {
  const { isAdmin, toggle } = useAdminMode();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleToggle = () => {
    const newStatus = toggle();
    toast({
      title: newStatus ? "Modo Admin Ativado" : "Modo Admin Desativado",
      description: newStatus
        ? "Você tem acesso ao painel administrativo"
        : "Voltando ao modo usuário",
      variant: newStatus ? "destructive" : "default",
    });
    
    if (newStatus) {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isAdmin ? "destructive" : "outline"}
          size="icon"
          className="relative"
        >
          <Shield className="h-4 w-4" />
          {isAdmin && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          Modo {isAdmin ? "Administrador" : "Usuário"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleToggle}>
          <Shield className="mr-2 h-4 w-4" />
          {isAdmin ? "Desativar Admin" : "Ativar Admin"}
        </DropdownMenuItem>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
              Ir para Admin Panel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/admin/tools")}>
              Gerenciar Ferramentas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/admin/users")}>
              Ver Usuários
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
              Configurações
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs text-muted-foreground">
          Atalho: Ctrl+Alt+A (⌘+Option+A no Mac)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
