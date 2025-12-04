import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Dashboard() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<"home" | "settings">("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Estado para controle da sidebar

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
    <div className="min-h-screen bg-background text-foreground flex font-sans relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Sidebar */}
      <aside
        className={`relative bg-sidebar text-sidebar-foreground border-r border-border flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
                 {/* Sidebar Header com Toggle Button */}
                <div className={`border-b border-border flex items-center justify-between relative ${isSidebarOpen ? "p-4" : "p-2"}`}>
                  <h2 className={`text-lg font-semibold text-foreground tracking-tight flex items-center ${isSidebarOpen ? "" : "justify-center"}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`lucide lucide-zap ${isSidebarOpen ? "mr-2" : ""}`}
                    >
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    <span className={isSidebarOpen ? "" : "hidden"}>
                      Alfa Nerf{" "}
                      <span className="text-xs bg-secondary px-1.5 py-0.5 rounded ml-2 text-secondary-foreground">
                        v1.0
                      </span>
                    </span>
                  </h2>
                  {/* Toggle Button */}
                  <Button
                    variant="ghost"
                    size="icon" // Assume que Button suporta tamanho 'icon'
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
                    className={`absolute top-3 p-1.5 ${isSidebarOpen ? "right-3" : "right-1.5"}`} // Ajusta posição e padding
                  >
                    {isSidebarOpen ? (
                      // Icone de seta para a esquerda (ChevronLeft)
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-left"
                      >
                        <path d="m15 4-6 6 6 6" />
                      </svg>
                    ) : (
                      // Icone de seta para a direita (ChevronRight)
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-right"
                      >
                        <path d="m9 4 6 6-6 6" />
                      </svg>
                    )}
                  </Button>
                </div>
        
                {/* Sidebar Navigation */}
                <nav className={`flex-1 space-y-1 ${isSidebarOpen ? "p-4" : "p-2"}`}>
                  <Button
                    variant={currentView === "home" ? "secondary" : "ghost"}
                    onClick={() => setCurrentView("home")}
                    className={`w-full text-sm ${
                      isSidebarOpen ? "justify-start px-4" : "justify-center px-2"
                    } ${
                      currentView === "home" ? "text-foreground" : "text-muted-foreground"
                    } group`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`lucide lucide-home ${isSidebarOpen ? "mr-2" : ""}`}
                    >
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    <span className={isSidebarOpen ? "" : "hidden"}>Visão Geral</span>
                  </Button>
                  <Button
                    variant={currentView === "settings" ? "secondary" : "ghost"}
                    onClick={() => setCurrentView("settings")}
                    className={`w-full text-sm ${
                      isSidebarOpen ? "justify-start px-4" : "justify-center px-2"
                    } ${
                      currentView === "settings" ? "text-foreground" : "text-muted-foreground"
                    } group`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`lucide lucide-settings ${isSidebarOpen ? "mr-2" : ""}`}
                    >
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.78 1.22a2 2 0 0 0 .73 2.73l.15.08a2 2 0 0 1 1 1.74v.44a2 2 0 0 1-1 1.73l-.15.08a2 2 0 0 0-.73 2.73l.78 1.22a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 1-1.74v.44a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.78-1.22a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.44a2 2 0 0 1 1-1.73l.15-.08a2 2 0 0 0 .73-2.73l-.78-1.22a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-1-1.74V2a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    <span className={isSidebarOpen ? "" : "hidden"}>Configurações</span>
                  </Button>
                </nav>
        
                {/* User Info and Logout */}
                <div className={`border-t border-border ${isSidebarOpen ? "p-4" : "p-2"}`}>
                  {/* Wrap user info in a div to hide it */}
                  <div className={isSidebarOpen ? "" : "hidden"}>
                    <div className="text-xs text-muted-foreground mb-2">Logado como</div>
                    <div
                      className="text-sm font-medium text-foreground truncate mb-4"
                      title={user?.email || ""}
                    >
                      {user?.email}
                    </div>
                  </div>
                  {/* Logout button always visible, but might be icon-only when collapsed */}
                  <Button
                    variant="destructive"
                    onClick={() => signOut(auth)}
                    className={`w-full ${isSidebarOpen ? "text-xs" : "flex justify-center"}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                       strokeLinejoin="round"
                      className={`lucide lucide-log-out ${isSidebarOpen ? "mr-2" : ""}`}
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
                    </svg>
                    <span className={isSidebarOpen ? "" : "hidden"}>Encerrar Sessão</span>
                  </Button>
                </div>      </aside>

      {/* Conteúdo Principal */}
      <main
            className={`flex-1 bg-background p-8 transition-all duration-300 ease-in-out`}      >
        {currentView === "home" && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-6">Visão Geral</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-lg">
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
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Versão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-foreground font-medium">Production-RC1</div>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
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

            <Card className="mt-8 p-8 border border-dashed border-border rounded flex flex-col items-center justify-center text-muted-foreground h-64 bg-muted/20 shadow-lg">
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
            <Card className="rounded border border-border divide-y divide-border shadow-lg">
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
