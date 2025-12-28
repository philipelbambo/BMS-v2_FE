// Authentication utility functions

// Function to logout user - clears authentication data and redirects to login
export const logoutUser = (navigate: (path: string, options?: { replace?: boolean }) => void, role: string) => {
  // Clear authentication token from localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  
  // Also clear the old keys that might be used in some components
  localStorage.removeItem('authToken');
  localStorage.removeItem('role');
  
  // Redirect to appropriate login page based on role
  if (role === 'admin') {
    navigate('/login-admin', { replace: true });
  } else {
    navigate('/login-tenant', { replace: true });
  }
};

// Function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('auth_token');
  return token !== null && token !== '';
};

// Function to get user role
export const getUserRole = (): string | null => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.role || null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

// Function to get username
export const getUsername = (): string | null => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.username || null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

// Function to get user name
export const getUserName = (): string | null => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.name || null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

// Function to prevent back navigation to login pages after authentication
export const preventBackNavigation = () => {
  // Replace the current state to prevent going back
  window.history.replaceState({ ...window.history.state, preventedBack: true }, document.title, window.location.href);

  // Push a new state to make it harder to go back to login
  window.history.pushState({ preventedBack: true }, document.title, window.location.href);
};

// Function to check if user can access a protected route
export const canAccessRoute = (requiredRole: string): boolean => {
  if (!isAuthenticated()) {
    return false;
  }
  
  const userRole = getUserRole();
  if (!userRole) {
    return false;
  }
  
  // For admin routes, only allow admin users
  if (requiredRole === 'admin' && userRole !== 'admin') {
    return false;
  }
  
  // For tenant routes, only allow tenant users
  if (requiredRole === 'tenant' && userRole !== 'tenant') {
    return false;
  }
  
  return true;
};