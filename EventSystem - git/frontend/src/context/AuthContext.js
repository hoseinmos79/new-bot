"use client";
import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ username: decoded.username || 'کاربر', ...decoded }); 
      } catch (error) {
        console.error("Token invalid", error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token, refresh) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('refresh_token', refresh);
    const decoded = jwtDecode(token);
    setUser({ username: decoded.username || 'کاربر', ...decoded });
    
    // هدایت هوشمند
    if (decoded.is_staff || decoded.is_superuser) {
      router.push('/admin'); 
    } else {
      router.push('/'); 
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    router.push('/login');
    window.location.reload(); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};