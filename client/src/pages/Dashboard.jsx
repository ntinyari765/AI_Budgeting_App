import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService";

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    type: "",
    category: "",
    amount: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ type: "", category: "", amount: "", description: "" });

  const token = localStorage.getItem("token");

  // Fetch transactions on load
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions(token);
        setTransactions(data);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };
    fetchTransactions();
  }, [token]);

  // Add transaction
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const newTrans = await addTransaction(form, token);
      setTransactions([newTrans, ...transactions]);
      setForm({ type: "", category: "", amount: "", description: "" });
    } catch (err) {
      console.error("Add transaction error:", err);
    }
  };

  // Delete transaction
  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id, token);
      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete transaction error:", err);
    }
  };

  // Start editing
  const handleEditClick = (trans) => {
    setEditingId(trans._id);
    setEditForm({
      type: trans.type,
      category: trans.category,
      amount: trans.amount,
      description: trans.description,
    });
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ type: "", category: "", amount: "", description: "" });
  };

  // Save edit
  const handleSaveEdit = async (id) => {
    try {
      const updated = await updateTransaction(id, editForm, token);
      setTransactions(transactions.map((t) => (t._id === id ? updated : t)));
      handleCancelEdit();
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
        <form onSubmit={handleAdd}>
          <input name="type" placeholder="Type" value={form.type} onChange={handleChange} required />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
          <input name="amount" placeholder="Amount" type="number" value={form.amount} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <button type="submit" style={{ background: "var(--purple)", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer" }}>
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
                  <input name="type" placeholder="Type" value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })} />
                  <input name="category" placeholder="Category" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} />
                  <input name="amount" placeholder="Amount" type="number" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} />
                  <input name="description" placeholder="Description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                  <button onClick={() => handleSaveEdit(t._id)} style={{ background: "green", color: "white", border: "none", padding: "0.3rem 0.6rem", borderRadius: "6px" }}>Save</button>
                  <button onClick={handleCancelEdit} style={{ background: "gray", color: "white", border: "none", padding: "0.3rem 0.6rem", borderRadius: "6px" }}>Cancel</button>
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
      </div>
    </div>
  );
}

