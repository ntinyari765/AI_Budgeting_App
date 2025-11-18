import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/transactions";

// Get all transactions
export const getTransactions = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Add a transaction
export const addTransaction = async (transactionData, token) => {
  const res = await axios.post(API_URL, transactionData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Update a transaction
export const updateTransaction = async (id, transactionData, token) => {
  const res = await axios.put(`${API_URL}/${id}`, transactionData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Delete a transaction
export const deleteTransaction = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
