import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Verifica si existe el token en localStorage
  const token = localStorage.getItem('token');

  // Si no hay token, redirige a la página de login (ruta raíz '/')
  if (!token) {
    // 'replace' evita que el usuario pueda volver a la ruta protegida con el botón "atrás"
    return <Navigate to="/" replace />;
  }

  // Si hay token, renderiza el contenido de la ruta hija (usando Outlet)
  // En nuestro caso, renderizará el Layout y la página correspondiente anidada.
  return <Outlet />;
};

export default ProtectedRoute;