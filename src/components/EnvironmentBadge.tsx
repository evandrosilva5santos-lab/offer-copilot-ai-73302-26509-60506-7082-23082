import { Badge } from "@/components/ui/badge";
import { useEnvironment } from "@/lib/envManager";
import { Server, Cloud, Laptop, Zap } from "lucide-react";

export function EnvironmentBadge() {
  const env = useEnvironment();
  
  const icons = {
    lovable: <Cloud className="w-3 h-3" />,
    dyad: <Zap className="w-3 h-3" />,
    v0: <Server className="w-3 h-3" />,
    local: <Laptop className="w-3 h-3" />,
  };
  
  const variants = {
    lovable: "default",
    dyad: "secondary",
    v0: "outline",
    local: "outline",
  } as const;
  
  return (
    <Badge variant={variants[env.name]} className="gap-1.5 text-xs">
      {icons[env.name]}
      {env.displayName}
    </Badge>
  );
}
