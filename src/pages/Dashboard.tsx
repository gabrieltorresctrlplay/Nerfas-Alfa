import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

// Import the new view components
import { DashboardHomeView } from "@/components/dashboard/DashboardHomeView";
import { DashboardProfileView } from "@/components/dashboard/DashboardProfileView";
import { DashboardSettingsView } from "@/components/dashboard/DashboardSettingsView";


export function Dashboard() {
  const [currentView, setCurrentView] = useState<"home" | "settings" | "profile">("home");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sidebar Resizable Width
  const [sidebarWidth, setSidebarWidth] = useState(256);

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
                "flex-1 bg-transparent transition-all duration-300 ease-in-out relative z-10", // Removed p-4 md:p-8 here
                "ml-0 md:ml-[var(--sidebar-width)]",
                "flex flex-col" // Added flex-col to fill height
            )}
      >
        {/* Mobile Header Trigger */}
        <div className="md:hidden flex items-center p-4"> {/* Added padding here */}
            <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)} className="-ml-2 mr-2">
                <Menu className="w-6 h-6" />
            </Button>
            <span className="font-semibold text-lg">Alfa Nerf</span>
        </div>

        {currentView === "home" && <DashboardHomeView />}
        {currentView === "profile" && <DashboardProfileView />}
        {currentView === "settings" && <DashboardSettingsView />}
      </main>
    </div>
  );
}
