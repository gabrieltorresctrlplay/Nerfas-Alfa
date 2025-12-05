import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";

// Import the new view components
import { DashboardHomeView } from "@/components/dashboard/DashboardHomeView";
import { DashboardProfileView } from "@/components/dashboard/DashboardProfileView";
import { DashboardSettingsView } from "@/components/dashboard/DashboardSettingsView";

export function Dashboard() {
  const [currentView, setCurrentView] = useState<
    "home" | "settings" | "profile"
  >("home");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div
      className="min-h-screen bg-background text-foreground flex font-sans relative overflow-x-hidden"
      style={
        {
          "--sidebar-width": isCollapsed ? "5rem" : "16rem",
        } as React.CSSProperties
      }
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
        setMobileOpen={setIsMobileOpen}
      />

      {/* Conteúdo Principal */}
      <main
        className={cn(
          "flex-1 bg-transparent transition-all duration-300 ease-in-out relative z-10",
          "ml-0 md:ml-[var(--sidebar-width)]",
          "flex flex-col"
        )}
      >
        {currentView === "home" && <DashboardHomeView />}
        {currentView === "profile" && <DashboardProfileView />}
        {currentView === "settings" && <DashboardSettingsView />}
      </main>
    </div>
  );
}
