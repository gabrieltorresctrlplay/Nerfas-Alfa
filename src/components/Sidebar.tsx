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
  User,
  Sun,
  Moon,
  Laptop,
  Check,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useTheme } from "@/contexts/ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface SidebarProps {
  currentView: "home" | "settings" | "profile";
  setCurrentView: (view: "home" | "settings" | "profile") => void;
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
  closeMobile,
}: SidebarProps) {
  const { user } = useAuth();

  // Handle auto-close mobile menu on resize
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
    "fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out hidden md:flex",
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
            <div
              className={cn(
                "absolute transition-all duration-300 flex items-center justify-center",
                expandedState ? "opacity-100 scale-100" : "opacity-0 scale-50"
              )}
            >
              <Zap className="w-6 h-6 text-primary fill-current" />
            </div>

            {/* Toggle Button - Visible when Collapsed (Desktop only) replacing Logo */}
            {!isMobile && (
              <div
                className={cn(
                  "absolute transition-all duration-300 flex items-center justify-center",
                  !expandedState
                    ? "opacity-100 scale-100 rotate-0"
                    : "opacity-0 scale-50 rotate-180"
                )}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleCollapsed}
                  className="h-8 w-8"
                  aria-label="Expandir sidebar"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Zone 2: Text/Title area */}
          <div
            className={cn(
              "flex-1 flex items-center overflow-hidden transition-all duration-300 ease-in-out px-2",
              expandedState
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            )}
          >
            <span className="font-semibold text-sidebar-foreground truncate">
              Alfa Nerf
            </span>
            <span className="ml-1.5 text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full shrink-0">
              v1.0
            </span>
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
            <Button
              variant="ghost"
              size="icon"
              onClick={closeMobile}
              className="mr-2 shrink-0"
            >
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
              onClick={() => {
                setCurrentView("home");
                if (isMobile) closeMobile();
              }}
              showExpanded={expandedState}
            />
          </nav>
        </div>

        {/* Footer - Profile Dropdown */}
        <div className="border-t border-sidebar-border p-2 shrink-0">
          <ProfileDropdown
            user={user}
            currentView={currentView}
            setCurrentView={setCurrentView}
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            onCloseMobile={closeMobile}
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
      <aside className={sidebarClass}>{content(false)}</aside>

      {/* Mobile Sidebar */}
      <aside className={mobileSidebarClass}>{content(true)}</aside>
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

function NavItem({
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
          ? "bg-sidebar-accent text-sidebar-accent-foreground before:absolute before:left-0 before:h-full before:w-1 before:bg-primary font-medium"
          : variant === "ghost"
          ? "text-sidebar-foreground hover:bg-sidebar-accent/50"
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

interface ProfileDropdownProps {
  user: any;
  currentView: "home" | "settings" | "profile";
  setCurrentView: (view: "home" | "settings" | "profile") => void;
  isCollapsed: boolean;
  isMobile: boolean;
  onCloseMobile: () => void;
}

function ProfileDropdown({
  user,
  currentView,
  setCurrentView,
  isCollapsed,
  isMobile,
  onCloseMobile,
}: ProfileDropdownProps) {
  const { theme, setTheme } = useTheme();

  const handleViewProfile = () => {
    setCurrentView("profile");
    if (isMobile) onCloseMobile();
  };

  const handleViewSettings = () => {
    setCurrentView("settings");
    if (isMobile) onCloseMobile();
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  const getThemeIcon = () => {
    if (theme === "light") return <Sun className="h-4 w-4" />;
    if (theme === "dark") return <Moon className="h-4 w-4" />;
    return <Laptop className="h-4 w-4" />;
  };

  const getThemeLabel = () => {
    if (theme === "light") return "Claro";
    if (theme === "dark") return "Escuro";
    return "Sistema";
  };

  // When collapsed, show only avatar with dropdown
  if (isCollapsed && !isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full h-12 p-0 hover:bg-sidebar-accent/50 rounded-md"
            title={user?.email || ""}
          >
            <div className="w-full h-full flex items-center justify-center shrink-0">
              <div className="h-10 w-10 rounded-full bg-secondary overflow-hidden flex items-center justify-center shrink-0 border-2 border-border hover:border-primary/50">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-primary">
                    {user?.email?.[0].toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="right"
          sideOffset={8}
          className="w-56"
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.displayName || "Usuário"}
              </p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleViewProfile}>
            <User className="mr-2 h-4 w-4" />
            <span>Ver Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleViewSettings}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="ml-2 p-2 rounded-full h-9 w-9">
                {getThemeIcon()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 rounded-xl">
              <div className="flex flex-col">
                <Button variant={theme === "light" ? "secondary" : "ghost"} onClick={() => setTheme("light")} className="justify-start w-full">
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Claro</span>
                  {theme === "light" && <Check className="ml-auto h-4 w-4" />}
                </Button>
                <Button variant={theme === "dark" ? "secondary" : "ghost"} onClick={() => setTheme("dark")} className="justify-start w-full">
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Escuro</span>
                  {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
                </Button>
                <Button variant={theme === "system" ? "secondary" : "ghost"} onClick={() => setTheme("system")} className="justify-start w-full">
                  <Laptop className="mr-2 h-4 w-4" />
                  <span>Sistema</span>
                  {theme === "system" && <Check className="ml-auto h-4 w-4" />}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // When expanded, show avatar + info with dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={currentView === "profile" ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start p-0 h-12 hover:bg-sidebar-accent/50 relative overflow-hidden group rounded-md",
            currentView === "profile" &&
              "bg-sidebar-accent before:absolute before:left-0 before:h-full before:w-1 before:bg-primary"
          )}
        >
          <div className="w-12 flex items-center justify-center shrink-0 h-full flex-none">
            <div className="h-9 w-9 rounded-full bg-secondary overflow-hidden flex items-center justify-center shrink-0 border-2 border-border hover:border-primary/50">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-primary">
                  {user?.email?.[0].toUpperCase()}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 text-left overflow-hidden px-2.5">
            <div className="text-sm font-medium text-sidebar-foreground truncate leading-tight">
              {user?.displayName || "Usuário"}
            </div>
            <div className="text-xs text-muted-foreground truncate leading-tight mt-0.5">
              {user?.email}
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="top"
        sideOffset={8}
        className="w-56"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.displayName || "Usuário"}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleViewProfile}>
          <User className="mr-2 h-4 w-4" />
          <span>Ver Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleViewSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="ml-2 p-2 rounded-full h-9 w-9">
                {getThemeIcon()}
                <span className="sr-only">Abrir seletor de tema</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 rounded-xl">
              <div className="flex flex-col">
                <Button variant={theme === "light" ? "secondary" : "ghost"} onClick={() => setTheme("light")} className="justify-start w-full">
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Claro</span>
                  {theme === "light" && <Check className="ml-auto h-4 w-4" />}
                </Button>
                <Button variant={theme === "dark" ? "secondary" : "ghost"} onClick={() => setTheme("dark")} className="justify-start w-full">
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Escuro</span>
                  {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
                </Button>
                <Button variant={theme === "system" ? "secondary" : "ghost"} onClick={() => setTheme("system")} className="justify-start w-full">
                  <Laptop className="mr-2 h-4 w-4" />
                  <span>Sistema</span>
                  {theme === "system" && <Check className="ml-auto h-4 w-4" />}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
