import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  CalendarCheck,
  FileText,
  HelpCircle,
  Settings,
  Home,
  ChevronDown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { UserInfo } from "@/types/auth";
import authService from "@/services/authService";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    allowedRoles: ["ADMIN", "LOGISTICA", "PROFESSOR", "ADMIN_LAB"],
  },
  {
    title: "Requerimentos",
    icon: Calendar,
    allowedRoles: ["ADMIN", "LOGISTICA", "PROFESSOR", "ADMIN_LAB"],
    items: [
      {
        title: "Requerimento Sala",
        url: "/solicitation/new",
        allowedRoles: ["ADMIN", "PROFESSOR", "LOGISTICA"],
      },
      {
        title: "Requerimento Laboratório",
        url: "/solicitation/newlab",
        allowedRoles: ["ADMIN", "PROFESSOR", "ADMIN_LAB"],
      },
      {
        title: "Pesquisar por Token",
        url: "/solicitation/search",
        allowedRoles: ["ADMIN", "LOGISTICA", "PROFESSOR", "ADMIN_LAB"],
      },
    ],
  },
  {
    title: "Listas",
    icon: Calendar,
    allowedRoles: ["ADMIN", "LOGISTICA"],
    items: [
      {
        title: "Requerimentos Salas",
        url: "/solicitation/list",
        allowedRoles: ["ADMIN", "LOGISTICA"],
      },
      {
        title: "Requerimentos Labs",
        url: "/solicitation/lab-list",
        allowedRoles: ["ADMIN", "ADMIN_LAB"],
      },
    ],
  },
  {
    title: "Gerenciamento",
    icon: Settings,
    allowedRoles: ["ADMIN"],
    items: [
      {
        title: "Professores",
        url: "/management/teachers",
        allowedRoles: ["ADMIN"],
      },
      { title: "Usuários", url: "/management/users", allowedRoles: ["ADMIN"] },
      {
        title: "Horários",
        url: "/management/schedules",
        allowedRoles: ["ADMIN"],
      },
      { title: "Salas", url: "/management/rooms", allowedRoles: ["ADMIN"] },
      {
        title: "Laboratório",
        url: "/management/labs",
        allowedRoles: ["ADMIN", "ADMIN_LAB"],
      },
    ],
  },
  {
    title: "Suporte",
    url: "/support",
    icon: HelpCircle,
    allowedRoles: ["ADMIN", "LOGISTICA", "PROFESSOR", "ADMIN_LAB"],
  },
  {
    title: "Sobre",
    url: "/about",
    icon: HelpCircle,
    allowedRoles: ["ADMIN", "LOGISTICA", "PROFESSOR", "ADMIN_LAB"],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  const [, setIsOpen] = useState(false);

  // Detecta se é mobile/tablet
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

  const canAccess = (roles?: string[]) => {
    if (!roles || roles.length === 0) return true; // público
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isActive = (path: string) => currentPath === path;
  const getNavCls = (active: boolean) =>
    active
      ? "bg-gray-800 text-white font-medium"
      : "text-white hover:bg-gray-700 transition-colors";

  const handleNavigate = (url: string) => {
    navigate(url);
    if (isMobile) setIsOpen(false);
  };

  return (
    <Sidebar className="bg-black text-white min-h-screen" collapsible="icon">
      <SidebarContent className="bg-black text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white font-semibold">
            Menu Principal
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems
                .filter((item) => canAccess(item.allowedRoles))
                .map((item) => {
                  const visibleSubItems =
                    item.items?.filter((sub) => canAccess(sub.allowedRoles)) ||
                    [];

                  if (item.items && visibleSubItems.length > 0) {
                    return (
                      <Collapsible
                        key={item.title}
                        defaultOpen={visibleSubItems.some((sub) =>
                          isActive(sub.url)
                        )}
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="w-full text-white hover:bg-gray-700">
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                              <ChevronDown className="ml-auto h-4 w-4" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {visibleSubItems.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    onClick={() => handleNavigate(subItem.url)}
                                    className={getNavCls(isActive(subItem.url))}
                                  >
                                    {subItem.title}
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  // Item sem subitens
                  if (!item.items) {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          onClick={() => handleNavigate(item.url!)}
                          className={getNavCls(isActive(item.url!))}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  }

                  return null;
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
