import { PropsWithChildren } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Role } from "@/utils/roles";
import { Outlet } from "react-router-dom";

export default function DashboardLayout({ role }: PropsWithChildren<{ role: Role }>) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="h-12 flex items-center gap-2 border-b border-border bg-background px-3">
            <SidebarTrigger className="ml-1" />
          </header>
          <div className="flex-1">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
