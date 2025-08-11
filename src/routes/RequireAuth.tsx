import { Navigate, useLocation } from "react-router-dom";
import { PropsWithChildren } from "react";
import { Role, getDashboardPathForRole } from "@/utils/roles";
import { useAuth } from "@/context/AuthContext";

export function RequireAuth({ children, allowedRoles }: PropsWithChildren<{ allowedRoles?: Role[] }>) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPathForRole(user.role)} replace />;
  }

  return children as JSX.Element;
}
