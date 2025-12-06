import { useState, type CSSProperties } from "react";
type DashboardView = "home" | "settings" | "profile";

import { DashboardHomeView } from "@/components/dashboard/DashboardHomeView";
import { DashboardProfileView } from "@/components/dashboard/DashboardProfileView";
import { DashboardSettingsView } from "@/components/dashboard/DashboardSettingsView";
import { Sidebar } from "@/components/sidebar/Sidebar";

export function Dashboard() {
  const [currentView, setCurrentView] = useState<DashboardView>("home");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const collapsedWidth = "3.5rem";
  const expandedWidth = "16rem";

  return (
    <div
      className="min-h-screen bg-background text-foreground flex font-sans relative"
      style={
        {
          "--sidebar-width": isSidebarCollapsed ? collapsedWidth : expandedWidth,
        } as CSSProperties
      }
    >
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      <main className="flex-1 min-h-screen ml-0 md:ml-[var(--sidebar-width)] transition-[margin] duration-300">
        {currentView === "home" && <DashboardHomeView />}
        {currentView === "profile" && <DashboardProfileView />}
        {currentView === "settings" && <DashboardSettingsView />}
      </main>
    </div>
  );
}
