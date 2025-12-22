    import { Navigate } from "react-router-dom";

    interface ProtectedRouteProps {
    children: JSX.Element;
    }

    const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const isAuthenticated = localStorage.getItem("auth_token");
    
    // Check if user is an admin
    const user = localStorage.getItem("user");
    const isAdmin = user ? JSON.parse(user).role === "admin" : false;

    return isAuthenticated && isAdmin ? children : <Navigate to="/login-admin" replace />;
    };

    export default ProtectedRoute;
