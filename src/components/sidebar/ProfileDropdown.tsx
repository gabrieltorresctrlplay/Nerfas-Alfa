import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Settings,
  LogOut,
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

interface ProfileDropdownProps {
  user: any;
  currentView: "home" | "settings" | "profile";
  setCurrentView: (view: "home" | "settings" | "profile") => void;
  isCollapsed: boolean;
  isMobile: boolean;
  onCloseMobile: () => void;
}

export function ProfileDropdown({
  user,
  setCurrentView,
  isCollapsed,
  isMobile,
  onCloseMobile,
}: ProfileDropdownProps) {
  const { theme, setTheme } = useTheme();

  const handleSignOut = () => {
    signOut(auth);
  };
  
  const showExpanded = !isCollapsed || isMobile;

  const handleNavigation = (view: "home" | "settings" | "profile") => {
    setCurrentView(view)
    if (isMobile) onCloseMobile();
  }
  
  const ThemeSelector = () => {
    const themeOptions = [
      { name: "Claro", value: "light", icon: <Sun className="mr-2 h-4 w-4" /> },
      { name: "Escuro", value: "dark", icon: <Moon className="mr-2 h-4 w-4" /> },
      { name: "Sistema", value: "system", icon: <Laptop className="mr-2 h-4 w-4" /> },
    ]
    return (
       <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              {themeOptions.find(t => t.value === theme)?.icon}
              <span>Tema</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 rounded-xl">
            <div className="flex flex-col">
              {themeOptions.map(option => (
                <Button 
                  key={option.value}
                  variant={theme === option.value ? 'secondary' : 'ghost'} 
                  onClick={() => setTheme(option.value as any)} 
                  className="justify-start w-full"
                >
                  {option.icon}
                  <span>{option.name}</span>
                  {theme === option.value && <Check className="ml-auto h-4 w-4" />}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Button
          variant={'ghost'}
          className={cn(
            'w-full h-12 flex items-center hover:bg-accent/50 group rounded-md transition-all duration-200',
            showExpanded ? 'justify-start px-2' : 'justify-center px-0'
          )}
          title={!showExpanded ? user?.displayName || user?.email : undefined}
        >
          {/* Icon */}
          <div className="h-9 w-9 rounded-full bg-secondary overflow-hidden flex items-center justify-center shrink-0 border-2 border-border group-hover:border-primary/50 transition-colors">
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

          {/* Label */}
          <div
            className={cn(
              'text-left overflow-hidden transition-all duration-200 ease-in-out',
              showExpanded
                ? 'max-w-[150px] opacity-100 ml-2.5'
                : 'max-w-0 opacity-0 ml-0'
            )}
          >
            <div className="text-sm font-medium text-card-foreground truncate leading-tight">
              {user?.displayName || 'Usuário'}
            </div>
            <div className="text-xs text-muted-foreground truncate leading-tight mt-0.5">
              {user?.email}
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side={!showExpanded ? "right" : "top"}
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
        <DropdownMenuItem onClick={() => handleNavigation("profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Ver Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigation("settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ThemeSelector />
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
