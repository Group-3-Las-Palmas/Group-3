import { fetchApi } from './apiServices'; // fetchApi for JSON calls
// Import URL
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

//Maybe we wont use it
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

export const updateUserProfile = async (userId, formData) => {
  const token = localStorage.getItem('token'); // Get token

  try {
    const response = await fetch(`${SERVER_BASE_URL}/api${BASE_ENDPOINT}/${userId}`, {
      method: 'PUT',
      headers: {
        // Fetch add Content-Type for FormData
        ...(token && { 'Authorization': `Bearer ${token}` }) // Add header if there is token
      },
      body: formData, // Request body is formData
    });

    // Parse response
    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        // if is not a JSON
        const text = await response.text();
        data = { message: text || `Received non-JSON response status: ${response.status}` };
    }

    // HTTP errors
    if (!response.ok) {
        // Backend message
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    // Return updated user
    return data;

  } catch (error) {
    console.error(`Update profile error for user ${userId}:`, error);
    // Throw error again
    throw error;
  }
};