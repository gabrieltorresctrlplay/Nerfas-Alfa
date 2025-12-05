import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Activity, CreditCard, Users, ArrowUpRight, BarChart, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming Button might be useful for some actions
import { useAuth } from "@/contexts/AuthContext"; // To get user's display name

export function DashboardHomeView() {
  const { user } = useAuth(); // Get user information

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 md:px-8">
        {/* Header Section */}
        <div className="flex items-center justify-between space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Olá, {user?.displayName || user?.email || "Usuário"}!
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>Hoje</span>
            </Button>
            <Button>Baixar Relatório</Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Total de Receita
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 45.231,89</div>
              <p className="text-xs text-muted-foreground">+20.1% do mês passado</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Inscrições
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">+180.1% do mês passado</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Vendas
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">+19% do mês passado</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Atividade Ativa
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">+201 do último mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Performance Overview (Chart Placeholder) */}
          <Card className="shadow-lg bg-card/80 backdrop-blur-sm col-span-4">
            <CardHeader>
              <CardTitle>Visão Geral de Performance</CardTitle>
              <CardDescription>Visualização de dados para o último mês.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center bg-muted/30 rounded-lg border border-dashed border-border text-muted-foreground">
                <BarChart className="h-16 w-16 opacity-50" />
                <p className="ml-4">Placeholder para gráfico de performance</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity (Feed Placeholder) */}
          <Card className="shadow-lg bg-card/80 backdrop-blur-sm col-span-3">
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Você fez 265 transações este mês.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                  JD
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Júlio Dutra</p>
                  <p className="text-sm text-muted-foreground">julio.dutra@example.com</p>
                </div>
                <div className="text-sm font-medium">+R$1.999,00</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-sm font-medium">
                  AN
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Ana Nascimento</p>
                  <p className="text-sm text-muted-foreground">ana.nascimento@example.com</p>
                </div>
                <div className="text-sm font-medium">+R$39,00</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-sm font-medium">
                  MS
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Márcio Silva</p>
                  <p className="text-sm text-muted-foreground">marcio.silva@example.com</p>
                </div>
                <div className="text-sm font-medium">+R$299,00</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">
                  FC
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Fernanda Castro</p>
                  <p className="text-sm text-muted-foreground">fernanda.castro@example.com</p>
                </div>
                <div className="text-sm font-medium">+R$99,00</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}