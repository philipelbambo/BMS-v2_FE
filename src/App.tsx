import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ThemeProvider } from "./contexts/ThemeContext";

// LAYOUTS
import MainLayout from "./layouts/MainLayout";
import TenantLayout from "./layouts/TenantLayout";

// PUBLIC PAGES
import LandingPage from "./pages/LandingPage";
import TenantLandingpage from "./pages/Tenant/TenantLandingpage";
import LoginAdmin from "./pages/auth/LoginAdmin";
import LoginTenant from "./pages/auth/LoginTenant";
import ForgotPasswordPage from "./pages/auth/ForgotPassword";
import Register from "./pages/auth/Register";
import TenantForm from "./pages/Tenant/TenantApplication";


// ADMIN PAGES
import Dashboard from "./pages/Admin/Dashboard";
import RoomManagement from "./pages/Admin/RoomManagement";
import Tenant from "./pages/Admin/Tenant";
import BookingRequestsAdmin from "./pages/Admin/BookingRequest";
import PaymentBill from "./pages/Admin/PaymentBill";
import Reports from "./pages/Admin/Reports";
import Settings from "./pages/Admin/Settings";
import AdminNotifications from "./pages/Admin/NotificationsCenter";

// TENANT PAGES
import TenantDashboard from "./pages/Tenant/TenantDashboard";
import TenantView from "./pages/Tenant/TenantView";
import TenantRequest from "./pages/Tenant/TenantRequest";
import TenantPay from "./pages/Tenant/TenantPay";
import TenantStatus from "./pages/Tenant/TenantStatus";

// ROUTE GUARDS
import ProtectedRoute from "./pages/ProtectedRoute";
import TenantProtectedRoute from "./pages/TenantProtectedRoute";

// OTHERS
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ToastContainer />

        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/tenant-landingpage" element={<TenantLandingpage />} />
          <Route path="/login-admin" element={<LoginAdmin />} />
          <Route path="/login-tenant" element={<LoginTenant />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Tenant-application" element={<TenantForm />} />

          {/* ================= ADMIN ================= */}
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
            <Route
              path="/admin/booking-requests"
              element={<BookingRequestsAdmin />}
            />
            <Route path="/admin/payment-bill" element={<PaymentBill />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route
              path="/admin/notifications"
              element={<AdminNotifications />}
            />
          </Route>

          {/* ================= TENANT ================= */}
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

          {/* ================= 404 ================= */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
