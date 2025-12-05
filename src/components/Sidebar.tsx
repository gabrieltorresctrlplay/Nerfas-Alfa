import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  Home,
  Settings,
  User,
  Zap,
  Menu,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NavItem } from "./sidebar/NavItem";
import { ProfileDropdown } from "./sidebar/ProfileDropdown";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type SidebarView = "home" | "settings" | "profile";

const navItems: { id: SidebarView; label: string; icon: ReactNode }[] = [
  {
    id: "home",
    label: "Visão Geral",
    icon: <Home className="h-5 w-5" aria-hidden />,
  },
  {
    id: "profile",
    label: "Perfil",
    icon: <User className="h-5 w-5" aria-hidden />,
  },
  {
    id: "settings",
    label: "Configurações",
    icon: <Settings className="h-5 w-5" aria-hidden />,
  },
];

interface SidebarProps {
  currentView: SidebarView;
  setCurrentView: (view: SidebarView) => void;
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  isMobileOpen: boolean;
  setMobileOpen: (isOpen: boolean) => void;
}

export function Sidebar({
  currentView,
  setCurrentView,
  isCollapsed,
  toggleCollapsed,
  isMobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const { user } = useAuth();

  const renderNavItems = (isMobile: boolean) => {
    const expandedState = isMobile ? true : !isCollapsed;
    return navItems.map((item) => (
      <NavItem
        key={item.id}
        icon={item.icon}
        label={item.label}
        isActive={currentView === item.id}
        onClick={() => {
          setCurrentView(item.id);
          if (isMobile) setMobileOpen(false);
        }}
        showExpanded={expandedState}
      />
    ));
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      <div
        className={cn(
          "flex items-center h-16 border-b border-muted/50",
          isCollapsed && !isMobile ? "justify-center px-2" : "justify-between px-3"
        )}
      >
        <div className={cn("flex items-center gap-3", isCollapsed && !isMobile ? "justify-center" : "")}>
          <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-primary/10 text-primary">
            <Zap className="h-5 w-5" />
          </div>
          {!isCollapsed && !isMobile && (
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-card-foreground">
                Alfa Nerf
              </span>
              <span className="text-[11px] font-medium uppercase text-muted-foreground">
                v1.0
              </span>
            </div>
          )}
           {isMobile && (
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-card-foreground">
                Alfa Nerf
              </span>
              <span className="text-[11px] font-medium uppercase text-muted-foreground">
                v1.0
              </span>
            </div>
          )}
        </div>

        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            aria-label="Alternar sidebar"
            className={cn(isCollapsed ? "absolute right-0 top-16 transform -translate-y-1/2 translate-x-1/2 bg-background border rounded-full h-8 w-8" : "")}
          >
           <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4">
        <nav className="space-y-1">{renderNavItems(isMobile)}</nav>
      </div>

      <div className="border-t border-muted/50 px-2 pb-4 pt-3">
        <div className="rounded-2xl border border-border/40 bg-background/70 p-2">
          <ProfileDropdown
            user={user}
            currentView={currentView}
            setCurrentView={setCurrentView}
            isCollapsed={isCollapsed || isMobile}
            isMobile={isMobile}
            onCloseMobile={() => setMobileOpen(false)}
          />
        </div>
      </div>
    </div>
  );


  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col fixed inset-y-0 left-0 z-40 bg-card border-r transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden p-4">
        <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
             <Button variant="outline" size="icon" >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent isMobile />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}