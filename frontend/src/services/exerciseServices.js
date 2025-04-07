import axios from "axios";

const API_URL = "http://localhost:3000/api/exercises";

export const getAllExercises = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getExerciseById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createExercise = async (exerciseData) => {
  const response = await axios.post(API_URL, exerciseData);
  return response.data;
};

export const updateExercise = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData);
  return response.data;
};

export const deleteExercise = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
