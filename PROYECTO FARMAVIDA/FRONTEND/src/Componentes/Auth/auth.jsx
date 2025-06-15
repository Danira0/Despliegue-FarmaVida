import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Configuración global de Axios para incluir el token en todas las solicitudes
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(response => response, error => {
  const isLoginRequest = error.config.url.includes('/api/auth/login');
  
  if (error.response && error.response.status === 401 && !isLoginRequest) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }
  return Promise.reject(error);
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [profileImage, setProfileImage] = useState(() => {
    const storedImage = localStorage.getItem('profileImage');
    return storedImage || '/Assets/perfil.png';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    // Asegurar que el objeto userData tenga rolId
    if (!userData.rolId) {
      userData.rolId = userData.rol === "Administrador" ? 1 : 2;
    }
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    
    if (userData.imagen_perfil) {
      setProfileImage(userData.imagen_perfil);
      localStorage.setItem('profileImage', userData.imagen_perfil);
    }
  };

  const logout = () => {
    setUser(null);
    setProfileImage('/Assets/perfil.png');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('profileImage');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  const updateProfileImage = (newImage) => {
    setProfileImage(newImage);
    localStorage.setItem('profileImage', newImage);
    
    if (user) {
      const updatedUser = { ...user, imagen_perfil: newImage };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      login, 
      logout,
      profileImage,
      updateProfileImage
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);