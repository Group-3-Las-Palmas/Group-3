// frontend/src/services/userExerciseServices.js

// Importa la función fetchApi que maneja la autenticación
import { fetchApi } from "./apiServices";

/**
 * Registra la finalización de un ejercicio para el usuario autenticado.
 * @param {number | string} exerciseId - El ID del ejercicio completado.
 * @returns {Promise<object>} - La respuesta del backend.
 */
export const markExerciseAsCompleted = async (exerciseId) => {
  // Llama a fetchApi pasando directamente la ruta relativa completa
  return await fetchApi("/user-exercises/complete", "POST", { exerciseId });
};

// --- Otras funciones de servicio frontend ---
export const getAllUserExercises = async () => {
  return await fetchApi("/user-exercises");
};

export const getUserExerciseById = async (id) => {
  return await fetchApi(`/user-exercises/${id}`);
};

export const getFavouriteExercisesByUser = async (userId) => {
  return await fetchApi(`/user-exercises/favourites/${userId}`);
};

export const createUserExercise = async (userExerciseData) => {
  return await fetchApi("/user-exercises", "POST", userExerciseData);
};

export const updateUserExercise = async (id, updatedData) => {
  return await fetchApi(`/user-exercises/${id}`, "PUT", updatedData);
};

export const deleteUserExercise = async (id) => {
  return await fetchApi(`/user-exercises/${id}`, "DELETE");
};

export const toggleFavoriteExercise = async (exerciseId) => {
  return await fetchApi("/user-exercises/toggle-favourite", "PATCH", {
    exerciseId,
  });
};
