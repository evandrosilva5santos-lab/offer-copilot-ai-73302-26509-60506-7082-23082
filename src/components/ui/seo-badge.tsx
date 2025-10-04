import { cn } from "@/lib/utils";

interface SeoBadgeProps {
  text: string;
  className?: string;
}

export function SeoBadge({ text, className }: SeoBadgeProps) {
  return (
    <div 
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full",
        "bg-primary/10 border border-primary/20",
        "backdrop-blur-sm",
        className
      )}
    >
      <span className="text-xs font-medium text-primary">{text}</span>
    </div>
  );
}
