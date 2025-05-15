import React, { createContext, useState, useEffect } from 'react';

// Creamos el contexto
export const AuthContext = createContext();

// Proveedor del contexto
export function AuthProvider({ children }) {
  const [roles, setRoles] = useState([]);  // Roles del usuario
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Estado de autenticación
  const [loading, setLoading] = useState(false);  // Estado de carga

  // Actualizamos los roles en el contexto
  const setUserRoles = (roles) => {
    setRoles(roles);
    setIsAuthenticated(true);  // El usuario está autenticado cuando se tienen los roles
  };

  // Obtener roles desde el localStorage (en caso de que se recargue la página)
  useEffect(() => {
    const storedRoles = localStorage.getItem("roles");
    if (storedRoles) {
      setRoles(JSON.parse(storedRoles));
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ roles, isAuthenticated, setUserRoles, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
