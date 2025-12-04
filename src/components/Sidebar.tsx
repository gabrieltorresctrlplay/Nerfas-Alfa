import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

interface SidebarProps {
  currentView: "home" | "settings";
  setCurrentView: (view: "home" | "settings") => void;
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  isMobileOpen: boolean;
  closeMobile: () => void;
}

export function Sidebar({
  currentView,
  setCurrentView,
  isCollapsed,
  toggleCollapsed,
  isMobileOpen,
  closeMobile
}: SidebarProps) {
  const { user } = useAuth();

  // Handle resizing to auto-close mobile menu if switching to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        closeMobile();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [closeMobile]);

  const sidebarClass = cn(
    "fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
    // Desktop width logic: hidden on mobile (default), flex on md
    "hidden md:flex",
    isCollapsed ? "w-16" : "w-64"
  );

  const mobileSidebarClass = cn(
    "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out md:hidden",
    isMobileOpen ? "translate-x-0" : "-translate-x-full"
  );

  const content = (isMobile: boolean) => (
    <>
      {/* Header */}
      <div className={cn("flex items-center h-16 border-b border-sidebar-border", isCollapsed && !isMobile ? "justify-center px-0" : "justify-between px-4")}>
        <div className={cn("flex items-center font-semibold text-sidebar-foreground", isCollapsed && !isMobile ? "hidden" : "flex")}>
             <Zap className="w-6 h-6 mr-2 text-primary fill-current" />
             <span className="truncate">Alfa Nerf</span>
             <span className="ml-2 text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full">v1.0</span>
        </div>

        {/* Icon only when collapsed desktop */}
        {isCollapsed && !isMobile && (
             <Zap className="w-6 h-6 text-primary fill-current" />
        )}

        {/* Desktop Toggle Button (Only visible when expanded) */}
        {!isMobile && !isCollapsed && (
            <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="hidden md:flex h-8 w-8"
            aria-label="Colapsar sidebar"
            >
            <ChevronLeft className="w-4 h-4" />
            </Button>
        )}

        {/* Mobile Close Button */}
        {isMobile && (
            <Button variant="ghost" size="icon" onClick={closeMobile} className="h-8 w-8">
                <ChevronLeft className="w-4 h-4" />
            </Button>
        )}
      </div>

      {/* Toggle Button for Collapsed State (Desktop) */}
      {!isMobile && isCollapsed && (
         <div className="flex justify-center py-2 border-b border-sidebar-border">
            <Button variant="ghost" size="icon" onClick={toggleCollapsed} className="h-8 w-8" aria-label="Expandir sidebar">
                <ChevronRight className="w-4 h-4" />
            </Button>
         </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
            <NavItem
                icon={<Home className="w-5 h-5" />}
                label="Visão Geral"
                isActive={currentView === "home"}
                onClick={() => { setCurrentView("home"); if(isMobile) closeMobile(); }}
                isCollapsed={isCollapsed && !isMobile}
            />
             <NavItem
                icon={<Settings className="w-5 h-5" />}
                label="Configurações"
                isActive={currentView === "settings"}
                onClick={() => { setCurrentView("settings"); if(isMobile) closeMobile(); }}
                isCollapsed={isCollapsed && !isMobile}
            />
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        {!isCollapsed || isMobile ? (
             <div className="mb-4 flex items-center gap-3 overflow-hidden">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium text-primary">{user?.email?.[0].toUpperCase()}</span>
                </div>
                <div className="flex-1 truncate min-w-0">
                    <div className="text-sm font-medium text-sidebar-foreground truncate" title={user?.email || ""}>{user?.email}</div>
                    <div className="text-xs text-muted-foreground">Usuário</div>
                </div>
             </div>
        ) : (
             <div className="mb-4 flex justify-center">
                 <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0" title={user?.email || ""}>
                     <span className="text-xs font-medium text-primary">{user?.email?.[0].toUpperCase()}</span>
                 </div>
             </div>
        )}

        <Button
            variant="destructive"
            className={cn("w-full justify-start overflow-hidden", (isCollapsed && !isMobile) ? "justify-center px-0" : "")}
            onClick={() => signOut(auth)}
            title="Encerrar Sessão"
        >
            <LogOut className={cn("w-4 h-4 shrink-0", (!isCollapsed || isMobile) ? "mr-2" : "")} />
            {(!isCollapsed || isMobile) && <span className="truncate">Encerrar Sessão</span>}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeMobile}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className={sidebarClass}>
        {content(false)}
      </aside>

      {/* Mobile Sidebar */}
      <aside className={mobileSidebarClass}>
        {content(true)}
      </aside>
    </>
  );
}

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
    isCollapsed: boolean;
}

function NavItem({ icon, label, isActive, onClick, isCollapsed }: NavItemProps) {
    return (
        <Button
            variant={isActive ? "secondary" : "ghost"}
            onClick={onClick}
            className={cn(
                "w-full justify-start overflow-hidden",
                isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                isCollapsed ? "justify-center px-0" : "px-4"
            )}
            title={isCollapsed ? label : undefined}
        >
            <span className="shrink-0">{icon}</span>
            {!isCollapsed && <span className="ml-2 truncate">{label}</span>}
        </Button>
    )
}
