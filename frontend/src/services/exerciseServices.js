import { fetchApi } from "./apiServices";

// Usa la ruta relativa para fetchApi
const API_ENDPOINT = "/exercises";

export const getAllExercises = async () => {
  // Llama a fetchApi con el endpoint relativo. GET es el método por defecto.
  return await fetchApi(API_ENDPOINT);
};

export const getExerciseById = async (id) => {
  // Llama a fetchApi con el endpoint específico del ejercicio.
  return await fetchApi(`${API_ENDPOINT}/${id}`);
};

export const createExercise = async (exerciseData) => {
  return await fetchApi(API_ENDPOINT, "POST", exerciseData);
};

export const updateExercise = async (id, updatedData) => {
  return await fetchApi(`${API_ENDPOINT}/${id}`, "PUT", updatedData);
};

export const deleteExercise = async (id) => {
  return await fetchApi(`${API_ENDPOINT}/${id}`, "DELETE");
};
