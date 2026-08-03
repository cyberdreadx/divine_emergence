import { ReactNode } from "react";
import { useRequireAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  actions?: ReactNode;
}

const AdminLayout = ({ children, title, actions }: AdminLayoutProps) => {
  useRequireAuth("admin");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full dark bg-sidebar-background text-sidebar-foreground">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <header className="h-14 flex items-center justify-between border-b border-sidebar-border px-4 sm:px-6 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <SidebarTrigger className="text-sidebar-foreground/60 hover:text-sidebar-foreground shrink-0" />
              <h1 className="font-serif text-lg text-sidebar-foreground truncate">{title}</h1>
            </div>
            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
