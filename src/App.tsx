import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CopilotProvider } from "./contexts/CopilotContext";
import { GlobalCopilot } from "./components/GlobalCopilot";
import { CopilotTrigger } from "./components/CopilotTrigger";
import { WelcomeDialog } from "./components/WelcomeDialog";
import { useAdminMode } from "./hooks/useAdminMode";
import Dashboard from "./pages/Dashboard";
import Agentes from "./pages/Agentes";
import Clientes from "./pages/Clientes";
import Ferramentas from "./pages/Ferramentas";
import API from "./pages/API";
import Configuracoes from "./pages/Configuracoes";
import Usuario from "./pages/Usuario";
import DynamicTool from "./pages/tools/DynamicTool";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminTools from "./pages/admin/Tools";
import AdminUsers from "./pages/admin/Users";
import AdminSettings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAdminMode();
  return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CopilotProvider>
        <Toaster />
        <Sonner />
        <WelcomeDialog />
        <BrowserRouter>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/tools" element={<AdminRoute><AdminTools /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            
            {/* User Routes */}
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/agentes" element={<Layout><Agentes /></Layout>} />
            <Route path="/clientes" element={<Layout><Clientes /></Layout>} />
            <Route path="/ferramentas" element={<Layout><Ferramentas /></Layout>} />
            <Route path="/ferramentas/:toolId" element={<Layout><DynamicTool /></Layout>} />
            <Route path="/api" element={<Layout><API /></Layout>} />
            <Route path="/configuracoes" element={<Layout><Configuracoes /></Layout>} />
            <Route path="/usuario" element={<Layout><Usuario /></Layout>} />
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
        <GlobalCopilot />
        <CopilotTrigger />
      </CopilotProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
