import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button"; // Added missing import
import { Palette, Bell, Shield } from "lucide-react";

export function DashboardSettingsView() {
  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Configurações do Sistema</h1>
        </div>

        {/* Appearance Section */}
        <Card className="bg-card/80 backdrop-blur-sm shadow-md">
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Palette className="w-6 h-6 text-primary" />
                  Aparência
                </CardTitle>
                <CardDescription>Gerencie o tema e a exibição da interface.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="grid gap-1">
                        <Label className="font-medium">Tema da Interface</Label>
                        <p className="text-sm text-muted-foreground">Alternar entre modo claro, escuro ou do sistema.</p>
                    </div>
                    <ThemeToggle />
                </div>
                {/* Additional appearance settings can go here */}
            </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card className="bg-card/80 backdrop-blur-sm shadow-md">
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Bell className="w-6 h-6 text-primary" />
                  Notificações
                </CardTitle>
                <CardDescription>Configure como e quando você recebe notificações.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="grid gap-1">
                        <Label htmlFor="email-notifications" className="font-medium">Notificações por Email</Label>
                        <p className="text-sm text-muted-foreground">Receber atualizações importantes e anúncios.</p>
                    </div>
                    <Switch id="email-notifications" />
                </div>
                <div className="flex items-center justify-between">
                    <div className="grid gap-1">
                        <Label htmlFor="push-notifications" className="font-medium">Notificações Push</Label>
                        <p className="text-sm text-muted-foreground">Receber alertas em tempo real no navegador.</p>
                    </div>
                    <Switch id="push-notifications" />
                </div>
            </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="bg-card/80 backdrop-blur-sm shadow-md">
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="w-6 h-6 text-primary" />
                  Segurança
                </CardTitle>
                <CardDescription>Gerencie as configurações de segurança da sua conta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="grid gap-1">
                        <Label className="font-medium">Autenticação de Dois Fatores (2FA)</Label>
                        <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança à sua conta.</p>
                    </div>
                    <Button variant="outline">Configurar 2FA</Button>
                </div>
                <div className="flex items-center justify-between">
                    <div className="grid gap-1">
                        <Label className="font-medium">Atividade da Sessão</Label>
                        <p className="text-sm text-muted-foreground">Visualize e encerre sessões ativas.</p>
                    </div>
                    <Button variant="outline">Ver Sessões</Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}