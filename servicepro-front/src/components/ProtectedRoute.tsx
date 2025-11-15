import { Navigate } from "react-router-dom";
import authService from "@/services/authService";
import { UserInfo } from "@/types/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserInfo["role"][];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const user = authService.getUser();
  const token = authService.getToken();

  // Bloqueia se não estiver logado
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // Bloqueia se o role não for permitido
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Permite acesso
  return <>{children}</>;
}
