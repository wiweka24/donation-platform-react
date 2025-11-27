import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-dvh flex flex-col overflow-hidden">
        <div className="h-12 border-b bg-black flex items-center px-2 shrink-0 border">
          <SidebarTrigger className="h-8 w-8 text-white" />
        </div>

        <div className="flex-1 p-4 overflow-y-auto w-full border">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
