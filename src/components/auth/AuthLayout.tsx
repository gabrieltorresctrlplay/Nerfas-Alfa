import type { ReactNode } from "react";
import { Bug, Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "@/contexts/ThemeProvider";
import { Button } from "@/components/ui/button";

function CompactThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex bg-card/50 backdrop-blur border border-border rounded-full p-1 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className={`h-8 w-8 rounded-full ${theme === 'light' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        title="Claro"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className={`h-8 w-8 rounded-full ${theme === 'dark' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        title="Escuro"
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("system")}
        className={`h-8 w-8 rounded-full ${theme === 'system' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        title="Sistema"
      >
        <Laptop className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">

      {/* Mobile Guard (Ant Check) - Only visible on very small screens (< 320px) */}
      <style>{`
        .ant-guard { display: none; }
        @media (max-width: 320px) {
          .ant-guard { display: flex !important; }
          .main-content { display: none !important; }
        }
      `}</style>
      <div className="ant-guard fixed inset-0 z-[100] bg-background flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
         <Bug className="w-24 h-24 mb-6 text-primary animate-bounce" />
         <h1 className="text-2xl font-bold mb-4">O que é isso? Uma tela para formigas? 🐜</h1>
         <p className="text-muted-foreground">Aumenta aí, chefia! Não dá pra usar o Alfa Nerf desse tamanho.</p>
         <p className="text-xs text-muted-foreground mt-8 opacity-50">Easter Egg #BugFinder</p>
      </div>

      {/* Theme Toggle Top Right */}
      <div className="absolute top-4 right-4 z-20">
         <CompactThemeToggle />
      </div>

      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="main-content relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card/50 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-2xl relative transition-all duration-300">
            {children}
        </div>
      </div>
    </div>
  )
}
