import React, { useState, useRef, type ReactNode } from "react";
import { Bug, Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "@/contexts/ThemeProvider";


function CompactThemeToggle() {
  const { setTheme, theme } = useTheme();
  const keys = ['light', 'dark', 'system'] as const;
  const labels = ['Claro', 'Escuro', 'Sistema'];
  const icons = [<Sun className="h-4 w-4" />, <Moon className="h-4 w-4" />, <Laptop className="h-4 w-4" />];
  const index = keys.indexOf(theme as any);
  const [focused, setFocused] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const focusIndex = (i: number) => {
    setFocused(i);
    const btn = containerRef.current?.querySelectorAll('button[data-seg]')[i] as HTMLElement | undefined;
    btn?.focus();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = ((focused ?? index) + 1) % keys.length;
      setTheme(keys[next]);
      focusIndex(next);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = ((focused ?? index) - 1 + keys.length) % keys.length;
      setTheme(keys[prev]);
      focusIndex(prev);
    } else if (e.key === 'Home') {
      e.preventDefault(); setTheme(keys[0]); focusIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault(); setTheme(keys[keys.length - 1]); focusIndex(keys.length - 1);
    }
  };

  return (
    <div className="relative" ref={containerRef} onKeyDown={handleKey} role="tablist" aria-label="Selecionar tema">
      <div className="relative inline-flex items-center bg-card/50 border border-border rounded-full p-1 shadow-sm">
        {/* sliding thumb */}
        <div
          aria-hidden
          className="absolute top-1/2 -translate-y-1/2 left-0 h-[calc(100%_-_0.5rem)] w-[33.3333%] rounded-full bg-secondary/90 transition-all duration-300"
          style={{ transform: `translateX(${(index) * 100}%) translateY(-50%)` }}
        />

        {keys.map((k, i) => {
          const selected = index === i;
          return (
            <button
              key={k}
              data-seg={i}
              role="tab"
              aria-selected={selected}
              tabIndex={0}
              onFocus={() => setFocused(i)}
              onBlur={() => setFocused(null)}
              onClick={() => setTheme(k)}
              className={`relative z-10 inline-flex items-center justify-center px-3 py-1 text-sm rounded-full transition-colors duration-200 ${selected ? 'text-secondary-foreground' : 'text-muted-foreground'}`}
              title={labels[i]}
            >
              <span className="sr-only">{labels[i]}</span>
              {icons[i]}
            </button>
          );
        })}
      </div>
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
