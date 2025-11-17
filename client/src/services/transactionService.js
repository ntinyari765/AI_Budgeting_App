import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/transactions";

// Get all transactions for logged-in user
export const getTransactions = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Add a new transaction
export const addTransaction = async (transaction, token) => {
  const res = await axios.post(API_URL, transaction, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Update transaction
export const updateTransaction = async (id, transaction, token) => {
  const res = await axios.put(`${API_URL}/${id}`, transaction, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Delete transaction
export const deleteTransaction = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
