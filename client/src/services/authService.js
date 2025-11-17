import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/users";

// Register
export const registerUser = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  return res.data;
};

// Login
export const loginUser = async (userData) => {
  const res = await axios.post(`${API_URL}/login`, userData);
  return res.data;
};
