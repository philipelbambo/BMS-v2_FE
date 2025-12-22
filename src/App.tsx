import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ThemeProvider } from "./contexts/ThemeContext";

import MainLayout from "./layouts/MainLayout";
import TenantLayout from "./layouts/TenantLayout";

import LandingPage from "./pages/LandingPage";
import LoginAdmin from "./pages/LoginAdmin";
import LoginTenant from "./pages/auth/LoginTenant";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/Dashboard";
import RoomManagement from "./pages/RoomManagement";
import Tenant from "./pages/Tenant";
import BookingRequestsAdmin from "./pages/BookingRequest";
import PaymentBill from "./pages/PaymentBill";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import AdminNotifications from "./pages/NotificationsCenter";

// TENANT PAGES - Corrected imports based on your folder structure
import TenantDashboard from "./pages/Tenant/TenantDashboard";
import TenantView from "./pages/Tenant/TenantView";
import TenantRequest from "./pages/Tenant/TenantRequest";
import TenantPay from "./pages/Tenant/TenantPay";
import TenantStatus from "./pages/Tenant/TenantStatus";

import NotFound from "./pages/NotFound";

import ProtectedRoute from "./pages/ProtectedRoute";
import TenantProtectedRoute from "./pages/TenantProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ToastContainer />

        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login-admin" element={<LoginAdmin />} />
          <Route path="/login-tenant" element={<LoginTenant />} />
          <Route path="/register" element={<Register />} />

          {/* ADMIN */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/rooms" element={<RoomManagement />} />
            <Route path="/admin/tenant" element={<Tenant />} />
            <Route path="/admin/booking-requests" element={<BookingRequestsAdmin />} />
            <Route path="/admin/payment-bill" element={<PaymentBill />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
          </Route>

          {/* TENANT */}
          <Route
            element={
              <TenantProtectedRoute>
                <TenantLayout />
              </TenantProtectedRoute>
            }
          >
            <Route path="/tenant/dashboard" element={<TenantDashboard />} />
            <Route path="/tenant/view" element={<TenantView />} />
            <Route path="/tenant/request" element={<TenantRequest />} />
            <Route path="/tenant/pay" element={<TenantPay />} />
            <Route path="/tenant/status" element={<TenantStatus />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
