
import { Brain, FileText, GitBranch, Settings, Sparkles, Plus, Search } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Brain },
  { title: "Notlar", url: "/notes", icon: FileText },
  { title: "Zihin Haritaları", url: "/mindmaps", icon: GitBranch },
  { title: "AI Asistan", url: "/ai-assistant", icon: Sparkles },
  { title: "Ayarlar", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavClass = (path: string) =>
    isActive(path) 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-r-2 border-primary" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300`}>
      <SidebarContent className="p-4">
        {/* Logo */}
        <div className="mb-6 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="font-bold text-lg text-foreground">MindFlow</h1>
                <p className="text-xs text-muted-foreground">Akıllı Not Uygulaması</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {!collapsed && (
          <div className="mb-6 space-y-2">
            <Button className="w-full justify-start gap-2 h-9" size="sm">
              <Plus className="w-4 h-4" />
              Yeni Not
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Arama..." 
                className="pl-9 h-9 bg-muted/50 border-0"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navigasyon
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={`${getNavClass(item.url)} flex items-center gap-3 px-3 py-2 rounded-lg transition-all`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Recent Notes */}
        {!collapsed && (
          <SidebarGroup className="mt-8">
            <SidebarGroupLabel>Son Notlar</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2">
                {[
                  "Proje Toplantısı Notları",
                  "Haftalık Planlama",
                  "AI Öğrenme Yolculuğu"
                ].map((note, index) => (
                  <div 
                    key={index}
                    className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md cursor-pointer transition-colors"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
