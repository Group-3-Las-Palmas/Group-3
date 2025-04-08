// URL base para las llamadas a la API
const API_BASE_URL = "http://localhost:3000/api";
export const SERVER_BASE_URL = "http://localhost:3000";

/**
 * Gestiona las respuestas de la API, parseando JSON o lanzando un error.
 * @param {Response} response - El objeto de respuesta fetch.
 * @returns {Promise<any>} - El cuerpo de la respuesta parseado.
 * @throws {Error} - Si la respuesta no es OK.
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  let data;
  if (contentType && contentType.indexOf("application/json") !== -1) {
    data = await response.json();
  } else {
    // Si no es JSON, intenta obtener el texto para el mensaje de error
    const text = await response.text();
    data = { message: text || `Received non-JSON response with status: ${response.status}` };
  }

  if (!response.ok) {
    // Lanza el mensaje de error del backend si está disponible, si no, un error genérico
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  return data; // Devuelve los datos si la respuesta es exitosa
};

/**
 * Registra un nuevo usuario.
 * @param {string} username - Nombre de usuario deseado.
 * @param {string} email - Email del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<object>} - La respuesta del backend.
 * @throws {Error} - Si el registro falla (ej: email/usuario ya existe, error del servidor).
 */
export const registerUser = async (username, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // El cuerpo debe contener los datos del usuario a registrar
      body: JSON.stringify({ username, email, password }),
    });
    // Utiliza handleResponse para gestionar éxito o error
    return await handleResponse(response);
  } catch (error) {
    console.error("Registration service error:", error);
    // Re-lanza el error para que el componente pueda manejarlo (ej: mostrar mensaje al usuario)
    throw error;
  }
};

/**
 * Realiza el login del usuario usando autenticación Basic.
 * @param {string} email - Email del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<object>} - La respuesta del backend (incluyendo el token).
 * @throws {Error} - Si el login falla.
 */
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${email}:${password}`)}`,
        "Content-Type": "application/json",
      },
      // No se necesita body para Basic Auth en este caso
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Login service error:", error);
    throw error;
  }
};

/**
 * Obtiene el token de autenticación almacenado en localStorage.
 * @returns {string | null} - El token o null si no existe.
 */
const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Realiza una petición autenticada genérica a la API usando token Bearer.
 * @param {string} endpoint - El endpoint de la API (ej: '/users').
 * @param {string} method - El método HTTP (GET, POST, PUT, DELETE, PATCH).
 * @param {object | null} body - El cuerpo de la petición para POST/PUT/PATCH.
 * @returns {Promise<any>} - La respuesta del backend.
 */
export const fetchApi = async (endpoint, method = "GET", body = null) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API fetch error (${method} ${endpoint}):`, error);
    throw error;
  }
};

// --- Examples of specific API functions using fetchApi ---

// Example: Get all posts (requires token)
export const getPosts = async () => {
  return await fetchApi("/posts"); // Defaults to GET
};

// Example: Create a new post (requires token)
export const createPost = async (content) => {
  return await fetchApi("/posts", "POST", { content });
};

// Example: Get user data by ID (requires token)
export const getUserById = async (userId) => {
  return await fetchApi(`/users/${userId}`);
};



export const getMindfulnessQuote = async () => {
  try {
    const response = await fetch('https://metaapi-mindfulness-quotes.p.rapidapi.com/v1/mindfulness', {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'metaapi-mindfulness-quotes.p.rapidapi.com',
        'x-rapidapi-key': 'c484c9e532msh2f0aec8a41c9b56p1a057cjsn41d56c80bc5a'
      }
    });

    if (!response.ok) throw new Error('No quote today, sorry!');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching mindfulness quote:', error);
    return null;
  }
};

// Add more functions for comments, exercises, users, etc. following this pattern
// Example: Get exercises
// export const getExercises = async () => {
//     return await fetchApi('/exercises');
// };
