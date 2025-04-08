// Group-3/frontend/src/services/userServices.js
import { fetchApi } from './apiServices'; // fetchApi se usa para llamadas JSON
// Importamos la URL base directamente para la nueva función de subida
import { SERVER_BASE_URL } from './apiServices';

const BASE_ENDPOINT = '/users';

export const getAllUsers = async () => {
  return await fetchApi(BASE_ENDPOINT);
};

export const getUserById = async (userId) => {
  // Esta función usa fetchApi y devolverá lo que el backend envíe para esa ruta GET
  // (asegúrate que el backend envía profile_image_url aquí si lo necesitas actualizado al instante)
  return await fetchApi(`${BASE_ENDPOINT}/${userId}`);
};

// Probablemente no se use, ya que el registro está en apiServices/authController
export const createUser = async (userData) => {
  return await fetchApi(BASE_ENDPOINT, 'POST', userData);
};

// Actualiza datos JSON como username o password
export const updateUser = async (userId, updateData) => {
  // updateData debería ser un objeto como { username: "nuevoNombre" }
  return await fetchApi(`${BASE_ENDPOINT}/${userId}`, 'PUT', updateData);
};

export const deleteUser = async (userId) => {
  return await fetchApi(`${BASE_ENDPOINT}/${userId}`, 'DELETE');
};

// --- NUEVA FUNCIÓN para actualizar perfil (incluyendo imagen con FormData) ---
/**
 * Actualiza el perfil del usuario, incluyendo potencialmente una imagen.
 * Usa FormData para permitir la subida de archivos.
 * @param {string|number} userId - El ID del usuario a actualizar.
 * @param {FormData} formData - El objeto FormData que contiene los campos a actualizar.
 * Debe incluir un campo 'profileImage' si se sube una imagen.
 * @returns {Promise<object>} - La respuesta del backend (el objeto de usuario actualizado).
 * @throws {Error} - Si la actualización falla.
 */
export const updateUserProfile = async (userId, formData) => {
  const token = localStorage.getItem('token'); // Obtener token para la autorización

  try {
    const response = await fetch(`${SERVER_BASE_URL}/api${BASE_ENDPOINT}/${userId}`, { // Construye la URL completa del endpoint PUT
      method: 'PUT',
      headers: {
        // NO añadir 'Content-Type'. Fetch lo hará automáticamente para FormData.
        ...(token && { 'Authorization': `Bearer ${token}` }) // Añade cabecera de autorización si hay token
      },
      body: formData, // El cuerpo de la petición es el FormData
    });

    // Parsear la respuesta (asumiendo que el backend responde con JSON incluso tras FormData)
    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        // Si no es JSON, intenta obtener texto como fallback o mensaje de error
        const text = await response.text();
        data = { message: text || `Received non-JSON response status: ${response.status}` };
    }

    // Manejar errores HTTP
    if (!response.ok) {
        // Usa el mensaje del backend si existe, si no, un error genérico
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    // Devuelve los datos (el usuario actualizado) si todo fue bien
    return data;

  } catch (error) {
    console.error(`Update profile error for user ${userId}:`, error);
    // Re-lanza el error para que el componente que llama pueda manejarlo
    throw error;
  }
};