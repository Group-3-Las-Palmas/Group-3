// Group-3/frontend/src/services/userServices.js
import { fetchApi } from './apiServices';

const BASE_ENDPOINT = '/users';

export const getAllUsers = async () => {
  return await fetchApi(BASE_ENDPOINT);
};

export const getUserById = async (userId) => {
  return await fetchApi(`${BASE_ENDPOINT}/${userId}`);
};

// Note: User creation might be handled by authController (register)
export const createUser = async (userData) => {
  // userData should contain { username, email, password }
  return await fetchApi(BASE_ENDPOINT, 'POST', userData);
};

export const updateUser = async (userId, updateData) => {
  // updateData might contain { username, password }
  return await fetchApi(`${BASE_ENDPOINT}/${userId}`, 'PUT', updateData);
};

export const deleteUser = async (userId) => {
  return await fetchApi(`${BASE_ENDPOINT}/${userId}`, 'DELETE');
};