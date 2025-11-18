import axios from "axios";

const USER_API = `${import.meta.env.VITE_API_URL}/users`;

console.log("API URL being used:", USER_API); // for debugging


export const registerUser = async (data) => {
  const res = await axios.post(`${USER_API}/register`, data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axios.post(`${USER_API}/login`, data);
  return res.data;
};

