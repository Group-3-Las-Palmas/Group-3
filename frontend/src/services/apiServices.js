// URL for API calls
const API_BASE_URL = "http://localhost:3000/api";
export const SERVER_BASE_URL = "http://localhost:3000";


const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  let data;
  if (contentType && contentType.indexOf("application/json") !== -1) {
    data = await response.json();
  } else {
    // If it is not JSON
    const text = await response.text();
    data = { message: text || `Received non-JSON response with status: ${response.status}` };
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
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${email}:${password}`)}`,
        "Content-Type": "application/json",
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
        'x-rapidapi-key': 'c484c9e532msh2f0aec8a41c9b56p1a057cjsn41d56c80bc5a' // Considera mover esta clave a variables de entorno
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