import type { ComponentType, CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  Settings2,
  UserRound,
  ChevronsLeft,
  Sun,
  Moon,
  Laptop,
  ChevronDown,
  Palette,
  LogOut,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

type SidebarView = "home" | "profile" | "settings";

interface SidebarProps {
  currentView: SidebarView;
  onNavigate: (view: SidebarView) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems: {
  id: SidebarView;
  label: string;
  icon: ComponentType<{ className?: string }>;
}[] = [{ id: "home", label: "Inicio", icon: LayoutDashboard }];

export function Sidebar({
  currentView,
  onNavigate,
  isCollapsed,
  onToggle,
}: SidebarProps) {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const themeTriggerRef = useRef<HTMLDivElement | null>(null);
  const themeContentRef = useRef<HTMLDivElement | null>(null);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [themeAlignOffset, setThemeAlignOffset] = useState(0);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setAvatarOpen(false);
      setThemeOpen(false);
      setLogoutConfirmOpen(false);
      await signOut(auth);
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  useEffect(() => {
    if (!themeOpen) return;
    const measure = () => {
      const triggerRect = themeTriggerRef.current?.getBoundingClientRect();
      const contentRect = themeContentRef.current?.getBoundingClientRect();
      if (triggerRect && contentRect) {
        const offset =
          triggerRect.bottom -
          triggerRect.top -
          (contentRect.bottom - contentRect.top);
        setThemeAlignOffset(offset);
      }
    };
    requestAnimationFrame(measure);
  }, [themeOpen]);

  const railSize = "calc(3.5rem + 1px)";
  const iconSquare = "h-10 w-10";
  const iconSize = "h-4 w-4";
  const expandedWidth = "16rem";
  const sidebarWidth = isCollapsed ? railSize : expandedWidth;

  const defaultAvatarUrl =
    "https://i.pinimg.com/736x/f7/cd/03/f7cd03608a383f79c6e64c0c4b7d02ae.jpg";
  const isGooglePlaceholder = (url?: string) => {
    if (!url) return false;
    const normalized = url.toLowerCase();
    if (!normalized.includes("googleusercontent.com")) return false;
    if (normalized.includes("/a/default")) return true;
    const hasBasicAPath =
      normalized.includes("/a/") && !normalized.includes("/a-/");
    const hasDefaultSize = normalized.includes("=s96-c");
    const knownLetter =
      "https://lh3.googleusercontent.com/a/ACg8ocLsOqyqVyXzigFgA-og6EV1xuWjS8q4lXJbDEXl_6X78Xyqwg=s96-c".toLowerCase();
    if (normalized === knownLetter) return true;
    return hasBasicAPath && hasDefaultSize;
  };
  const avatarUrl =
    user?.photoURL &&
    user.photoURL.trim().length > 0 &&
    !isGooglePlaceholder(user.photoURL)
      ? user.photoURL
      : defaultAvatarUrl;

  const userInitials =
    user?.displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <>
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
                <div
                  className={`grid ${iconSquare} aspect-square place-items-center rounded-xl bg-primary/15 text-primary font-semibold shrink-0`}
                >
                  NF
                </div>
                <div
                  className={cn(
                    "leading-tight transition-[max-width,opacity] duration-300 ease-in-out whitespace-nowrap",
                    isCollapsed
                      ? "max-w-0 opacity-0 pointer-events-none"
                      : "max-w-[200px] opacity-100"
                  )}
                >
                  <p className="text-base font-semibold tracking-tight">
                    Nerfas
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Control Center
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={onToggle}
                aria-label={
                  isCollapsed ? "Expandir sidebar" : "Recolher sidebar"
                }
                className={cn(
                  `grid ${iconSquare} aspect-square place-items-center rounded-xl border border-border/60 shadow-sm transition-all duration-300`,
                  "shrink-0",
                  isCollapsed ? "mx-auto" : ""
                )}
              >
                {isCollapsed ? (
                  <ChevronsLeft className="h-4 w-4 rotate-180" />
                ) : (
                  <ChevronsLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
          </header>

          <nav className={cn("flex-1 py-4 flex flex-col gap-3 w-full px-2")}>
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
                    "h-10 w-full",
                    isActive
                      ? "bg-primary/15 text-primary shadow-sm ring-1 ring-primary/20"
                      : "text-muted-foreground hover:bg-muted/60"
                  )}
                >
                  <span
                    className={`flex items-center justify-center ${iconSquare} aspect-square text-current shrink-0`}
                  >
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

          <footer className="border-t border-border/60 w-full px-2 py-2">
            <DropdownMenu
              open={avatarOpen}
              onOpenChange={(open) => {
                setAvatarOpen(open);
                if (!open) setThemeOpen(false);
                if (!open) triggerRef.current?.blur();
              }}
            >
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  ref={triggerRef}
                  className={cn(
                    "rounded-xl transition-colors duration-200 hover:bg-muted/70 flex items-center overflow-hidden",
                    "h-10 w-full"
                  )}
                >
                  <div
                    className={`shrink-0 ${iconSquare} flex items-center justify-center`}
                  >
                    <Avatar className="h-[28px] w-[28px] rounded-lg">
                      <AvatarImage
                        src={avatarUrl}
                        alt={user?.displayName || "User"}
                        className="object-cover"
                      />
                      <AvatarFallback className="rounded-lg text-xs">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <span
                    className={cn(
                      "text-left truncate transition-[opacity,max-width,transform] duration-300 ease-in-out ml-3 flex-1",
                      isCollapsed
                        ? "opacity-0 max-w-0 translate-x-[-10px] pointer-events-none"
                        : "opacity-100 max-w-[220px] translate-x-0"
                    )}
                  >
                    <span className="block text-sm font-semibold leading-tight">
                      {user?.displayName || "Usuario"}
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
              <DropdownMenuContent
                align="start"
                side="right"
                sideOffset={14}
                alignOffset={0}
                className="w-60 mb-2.5"
                onCloseAutoFocus={(event) => {
                  event.preventDefault();
                  triggerRef.current?.blur();
                }}
              >
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                    onNavigate("profile");
                    setAvatarOpen(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <UserRound className="h-4 w-4" />
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                    onNavigate("settings");
                    setAvatarOpen(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Settings2 className="h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSub
                  open={themeOpen}
                  onOpenChange={(open) => {
                    setThemeOpen(open);
                  }}
                >
                  <DropdownMenuSubTrigger
                    ref={themeTriggerRef}
                    className="flex items-center gap-2"
                  >
                    <Palette className="h-4 w-4" />
                    <span>Tema</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent
                    side="right"
                    sideOffset={5}
                    align="start"
                    alignOffset={themeAlignOffset}
                    avoidCollisions={false}
                    className="min-w-[10rem]"
                    style={{ marginLeft: "5px" }}
                    ref={themeContentRef}
                  >
                    <DropdownMenuRadioGroup
                      value={theme}
                      onValueChange={(value) => {
                        setTheme(value as "light" | "dark" | "system");
                        setAvatarOpen(true);
                        setThemeOpen(true);
                      }}
                    >
                      <DropdownMenuRadioItem
                        value="light"
                        className="flex items-center gap-2"
                        onSelect={(event) => {
                          event.preventDefault();
                          setAvatarOpen(true);
                          setThemeOpen(true);
                        }}
                      >
                        <Sun className="h-4 w-4" />
                        <span>Claro</span>
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="dark"
                        className="flex items-center gap-2"
                        onSelect={(event) => {
                          event.preventDefault();
                          setAvatarOpen(true);
                          setThemeOpen(true);
                        }}
                      >
                        <Moon className="h-4 w-4" />
                        <span>Escuro</span>
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="system"
                        className="flex items-center gap-2"
                        onSelect={(event) => {
                          event.preventDefault();
                          setAvatarOpen(true);
                          setThemeOpen(true);
                        }}
                      >
                        <Laptop className="h-4 w-4" />
                        <span>Sistema</span>
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                    setAvatarOpen(false);
                    setThemeOpen(false);
                    setLogoutConfirmOpen(true);
                  }}
                  className="flex items-center gap-2 text-destructive data-[highlighted]:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </footer>
        </div>
      </aside>

      <AlertDialog
        open={logoutConfirmOpen}
        onOpenChange={setLogoutConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sair da conta?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja sair? Você poderá voltar a qualquer momento
              fazendo login novamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setLogoutConfirmOpen(false);
                setAvatarOpen(false);
                setThemeOpen(false);
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
