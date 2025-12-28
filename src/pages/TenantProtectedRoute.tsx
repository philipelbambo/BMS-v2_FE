import { Navigate, useLocation } from "react-router-dom";
import { canAccessRoute } from "../utils/auth";

interface TenantProtectedRouteProps {
  children: JSX.Element;
}

const TenantProtectedRoute: React.FC<TenantProtectedRouteProps> = ({ children }) => {
  const hasAccess = canAccessRoute('tenant');

  if (!hasAccess) {
    // Redirect to login if not authenticated or not tenant
    return <Navigate to="/login-tenant" replace state={{ from: useLocation().pathname }} />;
  }

  return children;
};

export default TenantProtectedRoute;