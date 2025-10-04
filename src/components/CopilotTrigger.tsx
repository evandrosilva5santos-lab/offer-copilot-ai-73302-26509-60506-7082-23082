import { useEffect } from "react";
import { useCopilot } from "@/contexts/CopilotContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CopilotTrigger() {
  const { isOpen, toggleCopilot } = useCopilot();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleCopilot();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [toggleCopilot]);

  if (isOpen) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleCopilot}
            size="icon"
            className={cn(
              "fixed shadow-2xl z-40 animate-in zoom-in-50 bg-gradient-to-br from-primary to-accent hover:shadow-primary/50 transition-all hover:scale-110 rounded-full",
              isMobile 
                ? "bottom-4 right-4 h-12 w-12" 
                : "bottom-4 right-4 h-14 w-14"
            )}
          >
            <div className="relative">
              <Bot className={cn(isMobile ? "h-5 w-5" : "h-6 w-6")} />
              <Sparkles className="h-3 w-3 absolute -top-1 -right-1 animate-pulse text-accent-foreground" />
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="text-sm">
          <p>Abrir Copilot (⌘K)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
