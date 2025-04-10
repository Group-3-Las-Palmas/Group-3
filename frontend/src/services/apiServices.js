// frontend/src/services/apiServices.js

// URL base SIN el /api
const API_BASE_URL = "http://localhost:3000"; // <-- CAMBIO AQUÍ
export const SERVER_BASE_URL = "http://localhost:3000"; // Esta se mantiene igual

/**
 * Gestiona las respuestas de la API, parseando JSON o lanzando un error.
 * @param {Response} response - El objeto de respuesta fetch.
 * @returns {Promise<any>} - El cuerpo de la respuesta parseado.
 * @throws {Error} - Si la respuesta no es OK.
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  let data;

  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    // eslint-disable-next-line no-unused-vars
    } catch (_e) {
      console.warn("Failed to parse JSON response, reading as text.");
      const text = await response.text();
      throw new Error(text || `Invalid JSON received with status: ${response.status}`);
    }
  } else {
    const text = await response.text();
    if (!response.ok) {
        data = { message: text || `Received non-JSON response with status: ${response.status}` };
    } else {
        return text;
    }
  }

  if (!response.ok) {
    throw new Error(data?.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};


/**
 * Registra un nuevo usuario.
 * @param {string} username - Nombre de usuario deseado.
 * @param {string} email - Email del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<object>} - La respuesta del backend.
 * @throws {Error} - Si el registro falla.
 */
export const registerUser = async (username, email, password) => {
  try {
    // fetchApi ahora construirá http://localhost:3000/api/auth/register
    return await fetchApi('/auth/register', 'POST', { username, email, password });
  } catch (error) {
    console.error("Registration service error:", error);
    throw error;
  }
};

/**
 * Realiza el login del usuario usando autenticación Basic.
 * @param {string} email - Email del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<object>} - La respuesta del backend (incluyendo token y user).
 * @throws {Error} - Si el login falla.
 */
export const loginUser = async (email, password) => {
  try {
    // Construimos la URL completa manualmente aquí ya que no usa fetchApi
    const loginUrl = `${API_BASE_URL}/api/auth/login`; // Añadimos /api manualmente
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${email}:${password}`)}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
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
 * @param {string} endpoint - El endpoint relativo de la API (ej: '/users', '/user-exercises/complete'). Debe empezar con '/'.
 * @param {string} method - El método HTTP (GET, POST, PUT, DELETE, PATCH). Por defecto 'GET'.
 * @param {object | null} body - El cuerpo de la petición para POST/PUT/PATCH. Por defecto null.
 * @returns {Promise<any>} - La respuesta del backend parseada.
 * @throws {Error} - Si la petición fetch o la respuesta indican un error.
 */
export const fetchApi = async (endpoint, method = "GET", body = null) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
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
    // --- NUEVA CONSTRUCCIÓN DE URL ---
    // Asegura que el endpoint relativo empiece con '/'
    const relativeEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Combina la base (sin /api) + /api + endpoint relativo
    const finalUrl = `${API_BASE_URL}/api${relativeEndpoint}`; // <-- CAMBIO AQUÍ
    // ---------------------------------

    console.log(`Making API call: ${method} ${finalUrl}`);

    const response = await fetch(finalUrl, config);

    return await handleResponse(response);

  } catch (error) {
    console.error(`API fetch error (${method} ${endpoint}):`, error);
    throw error;
  }
};

// --- Examples of specific API functions using fetchApi ---
// (No necesitan cambios, ya que usan fetchApi con la ruta relativa correcta)

export const getPosts = async () => {
  return await fetchApi("/posts");
};

export const createPost = async (content) => {
  return await fetchApi("/posts", "POST", { content });
};

export const getUserById = async (userId) => {
  return await fetchApi(`/users/${userId}`);
};

export const fetchLoginHistory = async () => {
  return await fetchApi('/auth/login-history');
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
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching mindfulness quote:', error);
    throw error;
  }
};