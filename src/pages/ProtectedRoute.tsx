import { Navigate, useLocation } from "react-router-dom";
import { canAccessRoute } from "../utils/auth";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("auth_token");
  const hasAccess = canAccessRoute("admin") && !!token; // ✅ ensure token exists

  if (!hasAccess) {
    // Redirect to login-admin and replace history to prevent back navigation
    return <Navigate to="/login-admin" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
