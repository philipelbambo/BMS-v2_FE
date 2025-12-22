import { Navigate } from "react-router-dom";

interface TenantProtectedRouteProps {
  children: JSX.Element;
}

const TenantProtectedRoute: React.FC<TenantProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem("auth_token");
  
  // Check if user is a tenant
  const user = localStorage.getItem("user");
  const isTenant = user ? JSON.parse(user).role === "tenant" : false;

  return isAuthenticated && isTenant ? children : <Navigate to="/login-tenant" replace />;
};

export default TenantProtectedRoute;