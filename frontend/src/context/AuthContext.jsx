import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser, fetchCurrentUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Check auth status on mount using cookie-based session
  useEffect(() => {
    async function checkAuth() {
      const result = await fetchCurrentUser();
      if (result.success) {
        setUser(result.data.user);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/dashboard');
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
