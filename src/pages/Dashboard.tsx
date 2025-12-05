import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sidebar } from "@/components/Sidebar";
import { Menu, Save, User as UserIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "firebase/auth";

export function Dashboard() {
  const [currentView, setCurrentView] = useState<"home" | "settings" | "profile">("home");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useAuth();

  // Sidebar Resizable Width
  const [sidebarWidth, setSidebarWidth] = useState(256);

  // Profile State
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await updateProfile(user, {
        displayName,
        photoURL
      });
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
        className="min-h-screen bg-background text-foreground flex font-sans relative overflow-x-hidden"
        style={{ "--sidebar-width": isCollapsed ? "4rem" : `${sidebarWidth}px` } as React.CSSProperties}
    >
      {/* Background Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isCollapsed={isCollapsed}
        toggleCollapsed={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        closeMobile={() => setIsMobileOpen(false)}
        width={sidebarWidth}
        setWidth={setSidebarWidth}
      />

      {/* Conteúdo Principal */}
      <main
            className={cn(
                "flex-1 bg-transparent p-4 md:p-8 transition-all duration-300 ease-in-out relative z-10",
                "ml-0 md:ml-[var(--sidebar-width)]"
            )}
      >
        {/* Mobile Header Trigger */}
        <div className="md:hidden flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)} className="-ml-2 mr-2">
                <Menu className="w-6 h-6" />
            </Button>
            <span className="font-semibold text-lg">Alfa Nerf</span>
        </div>

        {currentView === "home" && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-6">Visão Geral</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Status do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-green-500 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Operacional
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Versão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-foreground font-medium">Production-RC1</div>
                </CardContent>
              </Card>
              <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Uptime
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-foreground font-medium">99.9%</div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8 p-8 border border-dashed border-border rounded flex flex-col items-center justify-center text-muted-foreground h-64 bg-muted/20 shadow-lg backdrop-blur-sm">
              <svg
                className="w-12 h-12 mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <p>Nenhuma atividade recente registrada.</p>
            </Card>
          </div>
        )}

        {currentView === "profile" && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
            </div>

            {/* Profile Section */}
            <Card className="bg-card/80 backdrop-blur-sm shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-primary" />
                        Informações do Usuário
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Avatar Area */}
                    <div className="flex items-center gap-6">
                        <div className="relative group shrink-0">
                            <div className="h-24 w-24 rounded-full bg-secondary overflow-hidden flex items-center justify-center border-2 border-border shadow-sm">
                                {photoURL ? (
                                    <img src={photoURL} alt="Avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-medium text-secondary-foreground">{displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 space-y-1">
                            <h3 className="font-medium text-lg">{displayName || "Usuário sem nome"}</h3>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="displayName">Nome de Exibição</Label>
                            <Input
                                id="displayName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Como você quer ser chamado?"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="photoURL">URL do Avatar</Label>
                            <Input
                                id="photoURL"
                                value={photoURL}
                                onChange={(e) => setPhotoURL(e.target.value)}
                                placeholder="https://exemplo.com/sua-foto.jpg"
                            />
                            <p className="text-xs text-muted-foreground">Cole um link direto para sua imagem de perfil.</p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email (Não editável)</Label>
                            <Input
                                id="email"
                                value={user?.email || ""}
                                disabled
                                className="bg-muted opacity-50 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button onClick={handleUpdateProfile} disabled={isLoading} className="w-full sm:w-auto">
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Salvar Alterações
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
          </div>
        )}

        {currentView === "settings" && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Configurações do Sistema</h1>
            </div>

            {/* Appearance Section */}
            <Card className="bg-card/80 backdrop-blur-sm shadow-md">
                 <CardHeader>
                    <CardTitle className="text-lg">Aparência</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="grid gap-1">
                            <Label className="font-medium">Tema da Interface</Label>
                            <div className="text-sm text-muted-foreground">Alternar entre modo claro e escuro.</div>
                        </div>
                        <ThemeToggle />
                    </div>
                </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
