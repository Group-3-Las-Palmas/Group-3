// URL for API calls
const API_BASE_URL = "http://localhost:3000/api";
export const SERVER_BASE_URL = "http://localhost:3000";


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
    // If it is not JSON
    const text = await response.text();
    if (!response.ok) {
        data = { message: text || `Received non-JSON response with status: ${response.status}` };
    } else {
        return text;
    }
  }

  if (!response.ok) {
    // Throw backend generic error
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  return data; // Return success response
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Body includes all user data
      body: JSON.stringify({ username, email, password }),
    });
    // Verify success or error
    return await handleResponse(response);
  } catch (error) {
    console.error("Registration service error:", error);
    // Throw error again to component can manage
    throw error;
  }
};

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
      // Without body
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Login service error:", error);
    throw error;
  }
};

const getToken = () => {
  return localStorage.getItem("token");
};

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

/**
 * Get login dates (YYYY-MM-DD) for authenticated user
 * @returns {Promise<string[]>} - Dates array in string.
 * @throws {Error} - Si la petición falla.
 */
export const fetchLoginHistory = async () => {
  // Use fetchApi already include token
  return await fetchApi('/auth/login-history'); // Endpoint GET
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