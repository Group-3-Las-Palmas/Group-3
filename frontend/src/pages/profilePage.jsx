import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import UserRewards from '../components/reward/userRewards';
import FavouriteExercises from '../components/activity/favourites';
// Quitar axios si no se usa más en este archivo
// import axios from 'axios';
import { getUserById } from '../services/userServices'; // Usar el servicio
import { SERVER_BASE_URL } from '../services/apiServices'; // Importar la URL base del servidor

// Definir la ruta a la imagen por defecto (ajustar si es necesario)
const DEFAULT_AVATAR_SRC = `${SERVER_BASE_URL}/uploads/without_image.webp`;

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Añadir estado de carga
  const [error, setError] = useState(null); // Añadir estado de error
  const navigate = useNavigate(); // Hook para navegación

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      let currentUserId = null;

      try {
        // 1. Obtener userId del usuario logueado desde localStorage
        const storedUserString = localStorage.getItem('user');
        if (!storedUserString) {
          throw new Error("User not logged in. Please log in again.");
        }
        const storedUser = JSON.parse(storedUserString);
        currentUserId = storedUser?.user_id; // Usar el ID del usuario almacenado

        if (!currentUserId) {
          throw new Error("User ID not found in stored data. Please log in again.");
        }

        // 2. Usar el servicio getUserById (que maneja el token internamente)
        const userData = await getUserById(currentUserId);
        setUser(userData);

      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message || 'Failed to load profile data.');
        // Opcional: Redirigir a login si hay error de autenticación
        if (err.message.includes('401') || err.message.includes('403') || err.message.includes('log in')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/'); // Redirigir a la página de login/landing
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]); // Añadir navigate como dependencia

  // Manejar estados de carga y error
  if (loading) return <div className="text-center p-4">Loading profile...</div>;
  if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  if (!user) return <div className="text-center p-4">User data could not be loaded.</div>;

  // 3. Construir la URL completa de la imagen usando SERVER_BASE_URL y profile_image_url
  const avatarSrc = user.profile_image_url
    ? `${SERVER_BASE_URL}${user.profile_image_url.startsWith('/') ? '' : '/'}${user.profile_image_url}`
    : DEFAULT_AVATAR_SRC; // Usar la imagen por defecto si no hay URL

  return (
    // Mantener la estructura Tailwind si la estás usando, o adaptar a tus estilos
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-yellow-50 to-yellow-200 px-4 pt-6 pb-20">
      {/* Profile pic and username */}
      <div className="flex flex-col items-center text-center relative"> {/* Añadido relative para posicionar el botón */}
        <img
          src={avatarSrc} // Usar la URL construida
          alt={`${user.username}'s avatar`} // Usar el nombre de usuario correcto
          className="w-24 h-24 rounded-full object-cover shadow-md mb-2 border-2 border-gray-200" // Añadir un borde sutil
          // 4. Fallback por si la imagen no carga
          onError={(e) => {
            console.warn(`Failed to load image: ${avatarSrc}. Falling back to default.`);
            e.target.onerror = null; // Prevenir bucles si la imagen por defecto tampoco carga
            e.target.src = DEFAULT_AVATAR_SRC;
          }}
        />
        <h2 className="text-xl font-semibold text-gray-800">{user.username}</h2>

        {/* Settings icon - Hacer que navegue a la página de ajustes */}
        <button
          onClick={() => navigate('/settingsUserPage')} // Navegar al hacer clic
          className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 p-2 rounded-full bg-white bg-opacity-50 hover:bg-opacity-75"
          aria-label="Go to settings"
          title="Go to settings"
        >
          <span role="img" aria-label="settings" style={{ fontSize: '1.5rem' }}>⚙️</span>
        </button>
      </div>

      {/* Badges */}
      <div className="mt-6">
        <h3 className="text-center text-lg font-bold mb-4 text-green-800">Your badges!</h3>
        {/* Pasar el userId correcto a los componentes hijos */}
        <UserRewards userId={user.user_id} />
      </div>

      {/* Split line */}
      <hr className="my-6 border-green-300" />

      {/* Favourite exercises */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-green-800">Favourite activities</h3>
        {/* Pasar el userId correcto a los componentes hijos */}
        <FavouriteExercises userId={user.user_id} />
      </div>

      {/* Padding extra al final si es necesario para que no quede pegado a la NavBar */}
      <div style={{ paddingBottom: '60px' }}></div>
    </div>
  );
};

export default UserProfilePage;