import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sidebar } from "@/components/Sidebar";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export function Dashboard() {
  const [currentView, setCurrentView] = useState<"home" | "settings">("home");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Estados das Configurações
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem("nerf_notif");
    return saved === "true";
  });
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [systemMessage, setSystemMessage] = useState(() => {
    return localStorage.getItem("nerf_sys_msg") || "";
  });

  // Salvar mensagem
  const handleSaveMessage = () => {
    localStorage.setItem("nerf_sys_msg", systemMessage);
    alert("Configuração salva localmente.");
  };

  // Toggle Notificações
  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    localStorage.setItem("nerf_notif", String(newState));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans relative overflow-x-hidden">
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
      />

      {/* Conteúdo Principal */}
      <main
            className={cn(
                "flex-1 bg-transparent p-4 md:p-8 transition-all duration-300 ease-in-out relative z-10",
                "ml-0", // Default mobile
                isCollapsed ? "md:ml-16" : "md:ml-64"
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

        {currentView === "settings" && (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-6">
              Configurações do Sistema
            </h1>
            <Card className="rounded border border-border divide-y divide-border shadow-lg bg-card/80 backdrop-blur-sm">
              {/* Toggle Notifications */}
              <div className="p-6 flex items-center justify-between">
                <div className="grid gap-1">
                  <Label
                    htmlFor="notifications-mode"
                    className="font-medium text-foreground"
                  >
                    Notificações de Alerta
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    Receber alertas críticos por e-mail.
                  </div>
                </div>
                <Switch
                  id="notifications-mode"
                  checked={notificationsEnabled}
                  onCheckedChange={toggleNotifications}
                />
              </div>

              {/* Maintenance Mode */}
              <div className="p-6 flex items-center justify-between">
                <div className="grid gap-1">
                  <Label
                    htmlFor="maintenance-mode"
                    className="font-medium text-foreground"
                  >
                    Modo de Manutenção
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    Suspende o acesso público temporariamente.
                  </div>
                </div>
                <Switch
                  id="maintenance-mode"
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>

              {/* System Message */}
              <div className="p-6">
                <Label className="font-medium text-foreground mb-2">
                  Mensagem Global do Sistema
                </Label>
                <div className="text-sm text-muted-foreground mb-3">
                  Esta mensagem será exibida no cabeçalho de todos os usuários.
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={systemMessage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSystemMessage(e.target.value)
                    }
                    placeholder="Ex: Manutenção programada às 22h"
                  />
                  <Button onClick={handleSaveMessage}>Salvar</Button>
                </div>
              </div>

              {/* Theme Toggle */}
              <div className="p-6 flex items-center justify-between">
                <div className="grid gap-1">
                  <Label htmlFor="theme-mode" className="font-medium text-foreground">
                    Tema da Interface
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    Selecione o tema de cor para o painel.
                  </div>
                </div>
                <ThemeToggle />
              </div>
            </Card>{" "}
            {/* Fechamento do Card */}
          </div>
        )}
      </main>
    </div>
  );
}
