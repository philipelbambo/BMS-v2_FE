import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

const useBackButtonProtection = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Function to handle back button navigation
    const handlePopState = (event: PopStateEvent) => {
      // Check if user is authenticated
      if (isAuthenticated()) {
        // Get user role to determine where to redirect
        const userRole = getUserRole();
        
        // If the user tried to go back to a login page, redirect to appropriate dashboard
        if (window.location.pathname.includes('/login') || window.location.pathname.includes('/register')) {
          if (userRole === 'admin') {
            navigate('/admin/dashboard', { replace: true });
          } else if (userRole === 'tenant') {
            navigate('/tenant/dashboard', { replace: true });
          }
        }
        
        // For any other protected route, push a new state to prevent going back
        window.history.pushState({}, document.title, window.location.href);
      } else {
        // If not authenticated, allow normal navigation
        // This allows users to navigate back to login if needed before authentication
      }
    };

    // Add event listener for popstate (back/forward button)
    window.addEventListener('popstate', handlePopState);

    // Push a new state to prevent going back to login when landing on dashboard
    window.history.pushState({}, document.title, window.location.href);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);
};

export default useBackButtonProtection;