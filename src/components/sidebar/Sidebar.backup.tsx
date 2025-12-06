import type { ComponentType, CSSProperties } from "react";
import {
  LayoutDashboard,
  Settings2,
  UserRound,
  ChevronsLeft,
  Sun,
  Moon,
  Laptop,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type SidebarView = "home" | "profile" | "settings";

interface SidebarProps {
  currentView: SidebarView;
  onNavigate: (view: SidebarView) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems: { id: SidebarView; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: "home", label: "Início", icon: LayoutDashboard },
  { id: "profile", label: "Perfil", icon: UserRound },
  { id: "settings", label: "Configurações", icon: Settings2 },
];

export function Sidebar({ currentView, onNavigate, isCollapsed, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const railSize = "3.5rem";
  const iconSquare = "h-10 w-10";
  const iconSize = "h-4 w-4";
  const expandedWidth = "16rem";
  const sidebarWidth = isCollapsed ? railSize : expandedWidth;

  const initials =
    (user?.displayName || user?.email || "U")
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <aside
      style={
        {
          "--rail-size": railSize,
          "--sidebar-width": sidebarWidth,
        } as CSSProperties
      }
      className="fixed inset-y-0 left-0 z-30"
    >
      <div
        className={cn(
          "relative flex h-full flex-col border-r bg-card/80 backdrop-blur-lg shadow-2xl",
          "supports-[backdrop-filter]:bg-card/70 transition-[width] duration-300 ease-in-out"
        )}
        style={
          {
            width: "var(--sidebar-width)",
          } as CSSProperties
        }
      >
        <header className="relative h-[var(--rail-size)] border-b border-border/60 w-full overflow-hidden">
          <div
            className={cn(
              "flex h-full w-full items-center transition-[padding] duration-300 ease-in-out",
              isCollapsed ? "justify-center px-0" : "justify-between px-2"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-2 overflow-hidden transition-all duration-300 ease-in-out",
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              )}
            >
              <div className={`grid ${iconSquare} aspect-square place-items-center rounded-xl bg-primary/15 text-primary font-semibold shrink-0`}>
                NF
              </div>
              <div
                className={cn(
                  "leading-tight transition-[max-width,opacity] duration-300 ease-in-out whitespace-nowrap",
                  isCollapsed ? "max-w-0 opacity-0 pointer-events-none" : "max-w-[200px] opacity-100"
                )}
              >
                <p className="text-base font-semibold tracking-tight">Nerfas</p>
                <p className="text-xs text-muted-foreground">Control Center</p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={onToggle}
              aria-label={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
              className={cn(
                `grid ${iconSquare} aspect-square place-items-center rounded-xl border border-border/60 shadow-sm transition-all duration-300`,
                "shrink-0",
                isCollapsed ? "mx-auto" : ""
              )}
            >
              {isCollapsed ? <ChevronsLeft className="h-4 w-4 rotate-180" /> : <ChevronsLeft className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        <nav
          className={cn(
            "flex-1 py-4 flex flex-col gap-3 w-full px-2"
          )}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "group/nav relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 overflow-hidden shrink-0",
                  "h-10 w-full", // Altura ajustada para formar quadrado 40x40 com o padding px-2
                  isActive
                    ? "bg-primary/15 text-primary shadow-sm ring-1 ring-primary/20"
                    : "text-muted-foreground hover:bg-muted/60"
                )}
              >
                <span className={`flex items-center justify-center ${iconSquare} aspect-square text-current shrink-0`}>
                  <Icon className={iconSize} />
                </span>
                <span
                  className={cn(
                    "text-left truncate transition-[opacity,max-width,transform] duration-300 ease-in-out ml-1",
                    isCollapsed 
                      ? "opacity-0 max-w-0 translate-x-[-10px] pointer-events-none" 
                      : "opacity-100 max-w-[200px] translate-x-0"
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <footer
          className={cn(
            "border-t border-border/60 w-full px-2 py-2"
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "rounded-xl transition-colors duration-200 hover:bg-muted/70 flex items-center overflow-hidden",
                  "h-10 w-full"
                )}
              >
                <div className={`shrink-0 ${iconSquare} flex items-center justify-center`}>
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Foto de perfil"}
                    className="h-[28px] w-[28px] aspect-square rounded-xl object-cover"
                    draggable={false}
                  />
                ) : (
                  <span className={`flex items-center justify-center ${iconSquare} aspect-square rounded-xl bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-semibold`}>
                    {initials}
                  </span>
                )}
                </div>
                <span
                  className={cn(
                    "text-left truncate transition-[opacity,max-width,transform] duration-300 ease-in-out ml-3 flex-1", // Aumentei ml-2 para ml-3 para dar respiro maior já que sidebar alargou
                    isCollapsed 
                      ? "opacity-0 max-w-0 translate-x-[-10px] pointer-events-none" 
                      : "opacity-100 max-w-[220px] translate-x-0"
                  )}
                >
                  <span className="block text-sm font-semibold leading-tight">
                    {user?.displayName || "Usuário"}
                  </span>
                  <span className="block text-xs text-muted-foreground leading-tight">
                    {user?.email || "Conta ativa"}
                  </span>
                </span>
                {!isCollapsed && (
                  <ChevronDown
                    className={cn(
                      `${iconSize} justify-self-end text-muted-foreground transition-opacity duration-300 shrink-0 mr-1`,
                      isCollapsed ? "opacity-0 hidden" : "opacity-100 block"
                    )}
                  />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" sideOffset={12} className="w-60">
              <DropdownMenuLabel className="flex items-center gap-3">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Foto de perfil"}
                    className="h-10 w-10 rounded-xl object-cover"
                    draggable={false}
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-semibold">
                    {initials}
                  </span>
                )}
                <div className="truncate">
                  <p className="text-sm font-semibold leading-tight">
                    {user?.displayName || "Usuário"}
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {user?.email || "Conta ativa"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                <DropdownMenuSubContent alignOffset={-2} className="min-w-[10rem]">
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
                  >
                    <DropdownMenuRadioItem value="light" className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      <span>Light</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark" className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      <span>Dark</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system" className="flex items-center gap-2">
                      <Laptop className="h-4 w-4" />
                      <span>System</span>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem disabled className="opacity-60">
                Nenhuma ação extra
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </footer>
      </div>
    </aside>
  );
}
