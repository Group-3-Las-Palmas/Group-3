import axios from "axios";

const API_URL = "http://localhost:3000/api/user-exercises";

// Obtener todos los registros
export const getAllUserExercises = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Obtener uno por ID
export const getUserExerciseById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Crear uno nuevo
export const createUserExercise = async (userExerciseData) => {
  const response = await axios.post(API_URL, userExerciseData);
  return response.data;
};

// Actualizar uno
export const updateUserExercise = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData);
  return response.data;
};

// Eliminar uno
export const deleteUserExercise = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
