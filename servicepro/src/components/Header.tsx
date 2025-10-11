import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import uerjLogo from "@/assets/uerj-logo.png";
import authService from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserInfo } from "@/types/auth";

export function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-3">
          <img src={uerjLogo} alt="UERJ" className="h-8 w-8" />
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              ServicePro
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Gerenciamento de Requerimentos
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span className="hidden md:inline">
                {user?.name || "Usuário"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground">
                {user?.registration}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Perfil:{" "}
                {user?.role === "ADMIN"
                  ? "Administrador"
                  : user?.role === "LOGISTICA"
                  ? "Logística"
                  : "Professor"}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2 text-destructive cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
