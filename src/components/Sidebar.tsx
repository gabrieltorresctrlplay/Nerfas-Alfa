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
    "hidden md:flex",
    isCollapsed ? "w-16" : "w-64"
  );

  const mobileSidebarClass = cn(
    "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out md:hidden",
    isMobileOpen ? "translate-x-0" : "-translate-x-full"
  );

  const showExpanded = !isCollapsed;

  const content = (isMobile: boolean) => {
    // On mobile, sidebar is always "expanded" visually inside the drawer
    const expandedState = isMobile ? true : showExpanded;

    return (
      <>
        {/* Header */}
        <div className="flex items-center h-16 border-b border-sidebar-border relative overflow-hidden shrink-0">
          {/* Zone 1: The 'Icon' area (64px) */}
          <div className="w-16 h-full flex items-center justify-center shrink-0 z-20 relative">
               {/* Logo Icon - Visible when Expanded */}
               <div className={cn("absolute transition-all duration-300 flex items-center justify-center", expandedState ? "opacity-100 scale-100" : "opacity-0 scale-50")}>
                  <Zap className="w-6 h-6 text-primary fill-current" />
               </div>

               {/* Toggle Button - Visible when Collapsed (Desktop only) replacing Logo */}
               {!isMobile && (
                   <div className={cn("absolute transition-all duration-300 flex items-center justify-center", !expandedState ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 rotate-180")}>
                       <Button variant="ghost" size="icon" onClick={toggleCollapsed} className="h-8 w-8" aria-label="Expandir sidebar">
                          <ChevronRight className="w-4 h-4" />
                       </Button>
                   </div>
               )}
          </div>

          {/* Zone 2: Text/Title area */}
          <div className={cn("flex-1 flex items-center overflow-hidden transition-all duration-300 ease-in-out", expandedState ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4")}>
               <span className="font-semibold text-sidebar-foreground truncate">Alfa Nerf</span>
               <span className="ml-2 text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full shrink-0">v1.0</span>
          </div>

          {/* Zone 3: Toggle Button (Expanded mode) - Pushed to right */}
          {!isMobile && expandedState && (
              <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapsed}
              className="mr-2 shrink-0 animate-in fade-in zoom-in duration-300"
              aria-label="Colapsar sidebar"
              >
              <ChevronLeft className="w-4 h-4" />
              </Button>
          )}

          {/* Mobile Close Button */}
          {isMobile && (
              <Button variant="ghost" size="icon" onClick={closeMobile} className="mr-2 shrink-0">
                  <ChevronLeft className="w-4 h-4" />
              </Button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
              <NavItem
                  icon={<Home className="w-5 h-5" />}
                  label="Visão Geral"
                  isActive={currentView === "home"}
                  onClick={() => { setCurrentView("home"); if(isMobile) closeMobile(); }}
                  showExpanded={expandedState}
              />
               <NavItem
                  icon={<Settings className="w-5 h-5" />}
                  label="Configurações"
                  isActive={currentView === "settings"}
                  onClick={() => { setCurrentView("settings"); if(isMobile) closeMobile(); }}
                  showExpanded={expandedState}
              />
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-2 shrink-0">
           <Button
                variant="ghost"
                className="w-full justify-start p-0 h-12 mb-1 hover:bg-sidebar-accent/50"
                title={!expandedState ? user?.email || "" : undefined}
           >
               <div className="w-12 flex items-center justify-center shrink-0 h-full">
                   <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">{user?.email?.[0].toUpperCase()}</span>
                   </div>
               </div>

               <div className={cn("flex-1 text-left overflow-hidden transition-all duration-300", expandedState ? "w-auto opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-2")}>
                  <div className="text-sm font-medium text-sidebar-foreground truncate max-w-[140px]">{user?.email}</div>
                  <div className="text-xs text-muted-foreground">Usuário</div>
               </div>
           </Button>

           <NavItem
              icon={<LogOut className="w-4 h-4" />}
              label="Encerrar Sessão"
              isActive={false}
              onClick={() => signOut(auth)}
              showExpanded={expandedState}
              variant="destructive"
           />
        </div>
      </>
    );
  };

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
    showExpanded: boolean;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

function NavItem({ icon, label, isActive, onClick, showExpanded, variant = "ghost" }: NavItemProps) {
    return (
        <Button
            variant={isActive ? "secondary" : variant}
            onClick={onClick}
            className={cn(
                "w-full justify-start p-0 overflow-hidden relative group h-10",
                isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" :
                (variant === "ghost" ? "text-sidebar-foreground hover:bg-sidebar-accent/50" : "")
            )}
            title={!showExpanded ? label : undefined}
        >
            {/* Icon Container - Centered in the first 48px (which matches the collapsed button width) */}
            <div className="w-12 flex items-center justify-center shrink-0 h-full">
                {icon}
            </div>

            {/* Label Container */}
            <span className={cn(
                "truncate transition-all duration-300 ease-in-out whitespace-nowrap",
                showExpanded ? "opacity-100 translate-x-0 max-w-[150px]" : "opacity-0 -translate-x-2 max-w-0"
            )}>
                {label}
            </span>
        </Button>
    )
}
