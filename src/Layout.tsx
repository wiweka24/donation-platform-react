import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <div className="border fixed bg-black w-full">
          <SidebarTrigger className="h-12 w-12" />
        </div>
        <div className="p-4 mt-12">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
