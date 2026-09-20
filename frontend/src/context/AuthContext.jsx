import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dipueditx_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('dipueditx_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.data) {
            setUser(res.data.data);
            localStorage.setItem('dipueditx_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.warn('Session expired or offline, keeping stored session');
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: jwtToken, ...userData } = res.data.data;
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem('dipueditx_token', jwtToken);
    localStorage.setItem('dipueditx_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (name, email, password, phone) => {
    const res = await api.post('/auth/register', { name, email, password, phone });
    const { token: jwtToken, ...userData } = res.data.data;
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem('dipueditx_token', jwtToken);
    localStorage.setItem('dipueditx_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('dipueditx_token');
    localStorage.removeItem('dipueditx_user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

