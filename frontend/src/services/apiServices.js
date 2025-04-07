// Group-3/frontend/src/services/apiService.js

const API_BASE_URL = "http://localhost:3000/api"; // Updated port to 3000

/**
 * Handles API responses, parsing JSON or throwing an error.
 * @param {Response} response - The fetch response object.
 * @returns {Promise<any>} - The parsed response body.
 * @throws {Error} - If the response is not OK.
 */
const handleResponse = async (response) => {
  // Check if the response is actually JSON before trying to parse
  const contentType = response.headers.get("content-type");
  let data;
  if (contentType && contentType.indexOf("application/json") !== -1) {
    data = await response.json();
  } else {
    // Handle non-JSON responses if necessary, or assume error if JSON was expected
    data = { message: await response.text() }; // Or handle differently
  }

  if (!response.ok) {
    // Try to get a specific error message from the backend, otherwise use a generic one
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  return data;
};

/**
 * Logs in the user using Basic Authentication.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} - The backend response (including the token).
 * @throws {Error} - If login fails.
 */
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST", // POST is standard for login, even with Basic Auth
      headers: {
        // Encode credentials in Base64 for Basic Auth
        Authorization: `Basic ${btoa(`${email}:${password}`)}`,
        // 'Content-Type' might not be strictly necessary without a body for Basic Auth,
        // but it's often good practice. Your backend middleware setup dictates this.
        "Content-Type": "application/json",
      },
      // No 'body' needed if using Basic Auth for login as per your `authenticateBasicCredentials` middleware
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Login service error:", error);
    // Re-throw the error so the component can handle it
    throw error;
  }
};

/**
 * Retrieves the stored authentication token from localStorage.
 * @returns {string | null} - The token or null if it doesn't exist.
 */
const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Makes a generic authenticated request to the API using Bearer token.
 * @param {string} endpoint - The API endpoint (e.g., '/users').
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE).
 * @param {object | null} body - The request body for POST/PUT requests.
 * @returns {Promise<any>} - The backend response.
 */
export const fetchApi = async (endpoint, method = "GET", body = null) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };

  // Add the Authorization header only if a token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
    // Added PATCH
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return await handleResponse(response); // Use the centralized handler
  } catch (error) {
    console.error(`API fetch error (${method} ${endpoint}):`, error);
    // Re-throw for component-level handling if needed
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

// Add more functions for comments, exercises, users, etc. following this pattern
// Example: Get exercises
// export const getExercises = async () => {
//     return await fetchApi('/exercises');
// };
