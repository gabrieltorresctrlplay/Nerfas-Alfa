import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  showExpanded: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function NavItem({
  icon,
  label,
  isActive,
  onClick,
  showExpanded,
  variant = "ghost",
}: NavItemProps) {
  return (
    <Button
      variant={isActive ? "secondary" : variant}
      onClick={onClick}
      className={cn(
        "w-full justify-start p-0 overflow-hidden relative group h-10 transition-all",
        isActive
          ? "bg-accent text-accent-foreground before:absolute before:left-0 before:h-full before:w-1 before:bg-primary font-medium"
          : variant === "ghost"
          ? "text-card-foreground hover:bg-accent/50"
          : ""
      )}
      title={!showExpanded ? label : undefined}
    >
      {/* Icon Container - Centered in the first 48px */}
      <div className="w-12 flex items-center justify-center shrink-0 h-full">
        {icon}
      </div>

      {/* Label Container */}
      <span
        className={cn(
          "truncate transition-all duration-300 ease-in-out whitespace-nowrap",
          showExpanded
            ? "opacity-100 translate-x-0 max-w-[150px]"
            : "opacity-0 -translate-x-2 max-w-0"
        )}
      >
        {label}
      </span>
    </Button>
  );
}
