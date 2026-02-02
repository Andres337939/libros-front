import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = () => {
      try {
        const storedToken = localStorage.getItem('biblioteca_token');
        const storedUser = localStorage.getItem('biblioteca_user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error cargando sesión:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await authAPI.login(username, password);
      
      // Guardar en estado
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      
      // Guardar en localStorage
      localStorage.setItem('biblioteca_token', data.token);
      localStorage.setItem('biblioteca_user', JSON.stringify(data.user));
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Credenciales incorrectas' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('biblioteca_token');
    localStorage.removeItem('biblioteca_user');
  };

  // Verificar si token está expirado (opcional)
  const checkTokenExpiration = () => {
    // Implementar lógica de verificación si es necesario
    return true;
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    checkTokenExpiration
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};