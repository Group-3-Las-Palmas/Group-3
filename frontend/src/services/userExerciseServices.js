import axios from "axios";

const API_URL = "http://localhost:3000/api/user-exercises";

export const getAllUserExercises = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getUserExerciseById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const getToken = () => {
  return localStorage.getItem("token");
};

export const getFavouriteExercisesByUser = async (userId) => {
  const token = getToken();
  if (!token) {
    console.error('Token no encontrado para getFavouriteExercisesByUser');
    throw new Error('Token de autenticación no encontrado.');
  }

  try {
    const response = await axios.get(`${API_URL}/favourites/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Include token
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching favourite exercises', error);
     if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.error("Expired token?");
    }
    throw error;
  }
};

export const createUserExercise = async (userExerciseData) => {
  const response = await axios.post(API_URL, userExerciseData);
  return response.data;
};

export const updateUserExercise = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData);
  return response.data;
};

export const deleteUserExercise = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
