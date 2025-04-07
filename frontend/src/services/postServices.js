import axios from "axios";

const API_URL = "http://localhost:3000/api/posts";

export const getAllPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getPostById = async (postId) => {
  const response = await axios.get(`${API_URL}/${postId}`);
  return response.data;
};

export const createPost = async (postData, token) => {
  const response = await axios.post(API_URL, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updatePost = async (postId, updatedData, token) => {
  const response = await axios.put(`${API_URL}/${postId}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deletePost = async (postId, token) => {
  const response = await axios.delete(`${API_URL}/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
