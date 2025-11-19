import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService";
import { getSuggestions } from "../utils/aiSuggestions";

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [form, setForm] = useState({
    type: "",
    category: "",
    amount: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ type: "", category: "", amount: "", description: "" });

  const token = localStorage.getItem("token");

  // Options for dropdowns
  const typeOptions = ["Income", "Expense"];
  const categoryOptions = ["Salary", "Food", "Transport", "Entertainment", "Health", "Bills", "Others"];

  // Fetch transactions on load
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions(token);
        setTransactions(data);

        // Safely get AI suggestions
        const aiSuggestions = getSuggestions(data || []);
        setSuggestions(aiSuggestions);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setSuggestions(["Unable to generate suggestions."]);
      }
    };
    fetchTransactions();
  }, [token]);

  // Add transaction
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, amount: Number(form.amount) };
      const newTrans = await addTransaction(payload, token);
      const updatedTransactions = [newTrans, ...transactions];
      setTransactions(updatedTransactions);
      setForm({ type: "", category: "", amount: "", description: "" });

      // Update AI suggestions
      setSuggestions(getSuggestions(updatedTransactions));
    } catch (err) {
      console.error("Add transaction error:", err);
    }
  };

  // Delete transaction
  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id, token);
      const updatedTransactions = transactions.filter((t) => t._id !== id);
      setTransactions(updatedTransactions);

      // Update AI suggestions
      setSuggestions(getSuggestions(updatedTransactions));
    } catch (err) {
      console.error("Delete transaction error:", err);
    }
  };

  // Edit transaction
  const handleEditClick = (trans) => {
    setEditingId(trans._id);
    setEditForm({
      type: trans.type,
      category: trans.category,
      amount: trans.amount,
      description: trans.description,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ type: "", category: "", amount: "", description: "" });
  };

  const handleSaveEdit = async (id) => {
    try {
      const payload = { ...editForm, amount: Number(editForm.amount) };
      const updated = await updateTransaction(id, payload, token);
      const updatedTransactions = transactions.map((t) => (t._id === id ? updated : t));
      setTransactions(updatedTransactions);
      handleCancelEdit();

      // Update AI suggestions
      setSuggestions(getSuggestions(updatedTransactions));
    } catch (err) {
      console.error("Update transaction error:", err);
    }
  };

  return (
    <div>
      <h2>Welcome, {user.name}</h2>

      {/* Add transaction form */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <h3>Add Transaction</h3>
        <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <select name="type" value={form.type} onChange={handleChange} required>
            <option value="" disabled>Select Type</option>
            {typeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <select name="category" value={form.category} onChange={handleChange} required>
            <option value="" disabled>Select Category</option>
            {categoryOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <input
            name="amount"
            placeholder="Amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            required
          />
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <button
            type="submit"
            style={{ background: "var(--purple)", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer" }}
          >
            Add
          </button>
        </form>
      </div>

      {/* Transactions list */}
      <div className="card">
        <h3>Your Transactions</h3>
        {transactions.length === 0 && <p>No transactions yet.</p>}
        <ul>
          {transactions.map((t) => (
            <li key={t._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid #ddd" }}>
              {editingId === t._id ? (
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <select
                    name="type"
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  >
                    <option value="" disabled>Select Type</option>
                    {typeOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>

                  <select
                    name="category"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  >
                    <option value="" disabled>Select Category</option>
                    {categoryOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>

                  <input
                    name="amount"
                    placeholder="Amount"
                    type="number"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                  />
                  <input
                    name="description"
                    placeholder="Description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                  <button
                    onClick={() => handleSaveEdit(t._id)}
                    style={{ background: "green", color: "white", border: "none", padding: "0.3rem 0.6rem", borderRadius: "6px" }}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    style={{ background: "gray", color: "white", border: "none", padding: "0.3rem 0.6rem", borderRadius: "6px" }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span>{t.type} - {t.category}: ${t.amount}</span>
                  <span>
                    <button onClick={() => handleEditClick(t)} style={{ color: "blue", marginRight: "0.5rem", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDelete(t._id)} style={{ color: "red", cursor: "pointer" }}>Delete</button>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>

        {/* AI suggestions */}
        <div style={{ marginTop: "1rem", background: "#f9f9f9", padding: "1rem", borderRadius: "6px" }}>
          <h4>AI Suggestions</h4>
          {suggestions.length === 0 ? (
            <p>No suggestions yet.</p>
          ) : (
            <ul>
              {suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
