import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Wrench, Sparkles, Keyboard, X } from "lucide-react";

export function WelcomeDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen welcome dialog
    const hasSeenWelcome = localStorage.getItem("offer-copilot-welcome-seen");
    if (!hasSeenWelcome) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("offer-copilot-welcome-seen", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Fechar</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-primary bg-clip-text text-transparent">
            Bem-vindo ao Offer Copilot! 🚀
          </DialogTitle>
          <DialogDescription className="text-base">
            Seu assistente inteligente para criação de ofertas irresistíveis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-4 items-start">
            <div className="p-3 rounded-lg bg-primary/10 shrink-0">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Ferramentas Poderosas</h3>
              <p className="text-sm text-muted-foreground">
                Acesse ferramentas IA para criar headlines, VSLs, ganchos e muito mais.
                Todas as ferramentas são dinâmicas e podem ser personalizadas.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-3 rounded-lg bg-accent/10 shrink-0">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">IA Integrada</h3>
              <p className="text-sm text-muted-foreground">
                Conecte seus próprios provedores de IA (Groq, DeepSeek, Gemini) ou use
                nossos modelos padrão para gerar conteúdo de alta qualidade.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-3 rounded-lg bg-destructive/10 shrink-0">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Modo Administrador</h3>
              <p className="text-sm text-muted-foreground">
                Como dono do sistema, você pode ativar o modo admin e gerenciar todas as
                ferramentas, usuários e configurações.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-3 rounded-lg bg-secondary/10 shrink-0">
              <Keyboard className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Atalho Rápido</h3>
              <p className="text-sm text-muted-foreground">
                Pressione{" "}
                <kbd className="px-2 py-1 text-xs bg-muted rounded">Ctrl</kbd>
                {" + "}
                <kbd className="px-2 py-1 text-xs bg-muted rounded">Alt</kbd>
                {" + "}
                <kbd className="px-2 py-1 text-xs bg-muted rounded">A</kbd>
                {" "}para ativar/desativar o modo admin a qualquer momento.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleClose} className="w-full" size="lg">
            Começar a Usar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
