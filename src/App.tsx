// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Pos from './pages/Pos';
import Report from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Main App Routes */}
            <Route element={<MainLayout />}>

              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/pos" element={<Pos />} />
              <Route path="/report" element={<Report />} />
              <Route path="/settings" element={<Settings />} />

            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
    </Router>
  );
}

export default App;
