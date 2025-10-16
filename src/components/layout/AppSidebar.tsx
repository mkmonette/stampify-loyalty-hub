import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/utils/roles";
import type { LucideIcon } from "lucide-react";
import { Home, Building, CreditCard, BarChart3, Settings, MoreHorizontal, Megaphone, Users, Palette, Gift, QrCode, Stamp, History, User, TicketPercent, Share2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

 type MenuItem = { title: string; url: string; icon: LucideIcon };

 function getMenu(role: Role): { title: string; items: MenuItem[] } {
  switch (role) {
    case "super-admin":
      return {
        title: "Super Admin",
        items: [
          { title: "Overview", url: "/super-admin", icon: Home },
          { title: "Tenants", url: "/super-admin/tenants", icon: Building },
          { title: "Subscriptions", url: "/super-admin/subscriptions", icon: CreditCard },
          { title: "Analytics", url: "/super-admin/analytics", icon: BarChart3 },
          { title: "Settings", url: "/super-admin/settings", icon: Settings },
          { title: "More", url: "/super-admin/more", icon: MoreHorizontal },
        ],
      };
    case "business-admin":
      return {
        title: "Business Admin",
        items: [
          { title: "Overview", url: "/business-admin", icon: Home },
          { title: "Campaigns", url: "/business-admin/campaigns", icon: Megaphone },
          { title: "Customers", url: "/business-admin/customers", icon: Users },
          { title: "Branding", url: "/business-admin/branding", icon: Palette },
          { title: "Rewards", url: "/business-admin/rewards", icon: Gift },
          { title: "Coupons", url: "/business-admin/coupons", icon: TicketPercent },
          { title: "QR Codes", url: "/business-admin/qr-codes", icon: QrCode },
          { title: "Analytics", url: "/business-admin/analytics", icon: BarChart3 },
          { title: "Referrals", url: "/business-admin/referrals", icon: Share2 },
          { title: "Settings", url: "/business-admin/settings", icon: Settings },
          { title: "More", url: "/business-admin/more", icon: MoreHorizontal },
        ],
      };
    case "customer":
    default:
      return {
        title: "Customer",
        items: [
          { title: "Overview", url: "/customer", icon: Home },
          { title: "Loyalty Cards", url: "/customer/loyalty-cards", icon: Stamp },
          { title: "Rewards", url: "/customer/rewards", icon: Gift },
          { title: "Scan", url: "/customer/scan", icon: QrCode },
          { title: "Referrals", url: "/customer/referrals", icon: Share2 },
          { title: "History", url: "/customer/history", icon: History },
          { title: "Profile", url: "/customer/profile", icon: User },
          { title: "More", url: "/customer/more", icon: MoreHorizontal },
        ],
      };
  }
}

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const role: Role = user?.role ?? "customer";
  const { title, items } = getMenu(role);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon" className="bg-card text-foreground border-r border-border">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="w-7 h-7 bg-gradient-primary rounded-md" />
          <span className="text-sm font-semibold">{title}</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url} end>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-border">
        <div className="flex flex-col gap-2">
          {user && (
            <div className="px-2 py-1 text-xs text-muted-foreground">
              <p className="font-medium text-foreground truncate">{user.name || user.email}</p>
              <p className="truncate">{user.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
