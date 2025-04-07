// Group-3/frontend/src/services/apiService.js

const API_BASE_URL = 'http://localhost:3000/api'; // Updated port to 3000

/**
 * Handles API responses, parsing JSON or throwing an error.
 * @param {Response} response - The fetch response object.
 * @returns {Promise<any>} - The parsed response body.
 * @throws {Error} - If the response is not OK.
 */
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    // Try to get a specific error message from the backend, otherwise use a generic one
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  return data;
};

/**
 * Logs in the user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} - The backend response (including the token).
 * @throws {Error} - If login fails.
 */
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
         // Encode credentials in Base64 for Basic Auth
        "Authorization": `Basic ${btoa(`${email}:${password}`)}`,
        "Content-Type": "application/json", // Although no body is sent, it's good practice if the backend expects it
      },
      // No 'body' needed if using Basic Auth for login as per your `authenticateBasicCredentials` middleware
      // body: JSON.stringify({ email, password }), // <- Commented out/Removed
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Login service error:", error);
    // Re-throw the error so the component can handle it
    throw error;
  }
};

/**
 * Retrieves the stored authentication token.
 * @returns {string | null} - The token or null if it doesn't exist.
 */
const getToken = () => {
    return localStorage.getItem("token");
}

/**
 * Makes a generic request to the API, adding the authentication token.
 * @param {string} endpoint - The API endpoint (e.g., '/users').
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE).
 * @param {object | null} body - The request body for POST/PUT requests.
 * @returns {Promise<any>} - The backend response.
 */
export const fetchApi = async (endpoint, method = 'GET', body = null) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (body && (method === 'POST' || method === 'PUT')) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`<span class="math-inline">\{API\_BASE\_URL\}</span>{endpoint}`, config);
        return await handleResponse(response);
    } catch (error) {
        console.error(`API fetch error (${method} ${endpoint}):`, error);
        throw error;
    }
};

// --- You can add more functions for other endpoints here ---
// Example for getting posts (requires token)
// export const getPosts = async () => {
//   return await fetchApi('/posts', 'GET');
// };

// Example for creating a post (requires token)
// export const createPost = async (content) => {
//   return await fetchApi('/posts', 'POST', { content });
// };

// ...etc. for users, comments, exercises...