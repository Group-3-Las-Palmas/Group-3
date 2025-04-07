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
