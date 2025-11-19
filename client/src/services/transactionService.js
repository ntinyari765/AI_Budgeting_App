import axios from "axios";

const TRANSACTION_API = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/transactions`
  : "http://localhost:5000/api/transactions";

// Get all transactions
export const getTransactions = async (token) => {
  const res = await axios.get(TRANSACTION_API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Add a transaction
export const addTransaction = async (transactionData, token) => {
  const res = await axios.post(TRANSACTION_API, transactionData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// Update a transaction
export const updateTransaction = async (id, transactionData, token) => {
  const res = await axios.put(`${TRANSACTION_API}/${id}`, transactionData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// Delete a transaction
export const deleteTransaction = async (id, token) => {
  const res = await axios.delete(`${TRANSACTION_API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
