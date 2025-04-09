import axios from "axios";

const API_URL = "http://localhost:3000/api/rewards";

export const getAllRewards = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getRewardById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const getToken = () => {
  return localStorage.getItem("token");
};

export const getUserRewards = async (userId) => {
  const token = getToken();
  if (!token) {
    console.error('Token no encontrado para getUserRewards');
    throw new Error('Token de autenticación no encontrado.');
  }

  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Include token
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching rewards', error);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.error("Token expired?");
    }
    throw error;
  }
};

export const createReward = async (rewardData) => {
  const response = await axios.post(API_URL, rewardData);
  return response.data;
};

export const updateReward = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData);
  return response.data;
};

export const deleteReward = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
