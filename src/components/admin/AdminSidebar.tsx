import {
  CalendarDays, Users, Handshake, FileText, Settings, LogOut,
  LayoutDashboard, Globe, ShoppingCart, BarChart3, MessageSquare,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

const manageItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Events", url: "/admin/events", icon: CalendarDays },
  { title: "Guests", url: "/admin/guests", icon: Users },
  { title: "Partners", url: "/admin/partners", icon: Handshake },
  { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
  { title: "Deliverables", url: "/admin/deliverables", icon: FileText },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Surveys", url: "/admin/surveys", icon: MessageSquare },
];

const settingsItems = [
  { title: "View Site", url: "/", icon: Globe },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="px-4 py-5">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-sidebar-foreground text-xs font-serif">B&B</span>
            </div>
            <div>
              <p className="text-sidebar-foreground text-sm font-medium leading-tight">Breathe &amp; Bloom</p>
              <p className="text-sidebar-foreground/50 text-xs">Admin Panel</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 mx-auto rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sidebar-foreground text-[10px] font-serif">B&B</span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] tracking-[0.15em] uppercase mb-1">
            Manage
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {manageItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] tracking-[0.15em] uppercase mb-1">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={signOut}
              tooltip="Sign Out"
              className="hover:bg-sidebar-accent/50 text-sidebar-foreground/60"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {!collapsed && user && (
          <p className="text-sidebar-foreground/30 text-[10px] px-2 mt-2 truncate">
            {user.email}
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
