import { Home, Users, Zap, Wrench, Key, Settings, User, Shield } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAdminMode } from "@/hooks/useAdminMode";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Agentes", url: "/agentes", icon: Zap },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Ferramentas", url: "/ferramentas", icon: Wrench },
  { title: "API", url: "/api", icon: Key },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
  { title: "Usuário", url: "/usuario", icon: User },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const { isAdmin } = useAdminMode();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold gradient-primary bg-clip-text text-transparent">
            {open && "Offer Copilot"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-destructive">
              {open && "Administração"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/admin/dashboard"
                      className={({ isActive }) =>
                        isActive
                          ? "bg-destructive/20 text-destructive font-medium"
                          : "hover:bg-destructive/10 text-destructive"
                      }
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin Panel</span>
                      {open && <Badge variant="destructive" className="ml-auto">Admin</Badge>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
