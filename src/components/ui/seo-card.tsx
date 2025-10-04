import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SeoCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function SeoCard({ title, description, icon, className, onClick }: SeoCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-seo-card p-6 rounded-xl transition-all animate-fade-in",
        "hover-scale hover-glow cursor-pointer",
        "border border-primary/10",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2 text-gradient">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
