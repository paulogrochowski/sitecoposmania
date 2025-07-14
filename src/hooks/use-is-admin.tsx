
'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Function to check the cookie
    const checkAdminCookie = () => {
        const adminCookie = Cookies.get('admin-session');
        setIsAdmin(!!adminCookie);
    };

    // Initial check
    checkAdminCookie();

    // Optional: Listen for changes (e.g., if you have custom events for login/logout)
    // window.addEventListener('auth-change', checkAdminCookie);

    // Re-check periodically in case of cookie changes in other tabs
    const interval = setInterval(checkAdminCookie, 2000); // Check every 2 seconds

    return () => {
      // window.removeEventListener('auth-change', checkAdminCookie);
      clearInterval(interval);
    };
  }, []);

  return isAdmin;
}
