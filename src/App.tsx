// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layout
import MainLayout from "./layouts/MainLayout";

// Context
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginAdmin from "./pages/LoginAdmin";
import LoginTenant from "./pages/auth/LoginTenant";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import TenantManagement from "./pages/Tenant";
import TenantDashboard from "./pages/TenantDashboard"; // ✅ FIXED
import RequestedChanges from "./pages/RequestedReservation";
import ApartmentManagement from "./pages/Apartment";
import RentPayment from "./pages/RentPayment";
import Maintenance from "./pages/Maintenance";
import StaffManagement from "./pages/StaffManagement";
import ReportsDashboard from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Protected Route
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/tenant-dashboard" element={<TenantDashboard />} />
          <Route path="/login-admin" element={<LoginAdmin />} />
          <Route path="/login-tenant" element={<LoginTenant />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Pages */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tenants" element={<TenantManagement />} />
            <Route path="/requested-changes" element={<RequestedChanges />} />
            <Route path="/apartments" element={<ApartmentManagement />} />
            <Route path="/rent-payments" element={<RentPayment />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/staff" element={<StaffManagement />} />
            <Route path="/reports" element={<ReportsDashboard />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;