import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Chart } from "chart.js/auto";

const API_URL = "http://localhost:5000/api/transactions";

const incomeCategories = ["Salary", "Business", "Other"];
const expenseCategories = ["Food", "Transport", "Entertainment", "Bills", "Other"];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    type: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Add or update transaction
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...form,
        amount: Number(form.amount), // ensure amount is a number
        type: form.type, // explicitly include type
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditingId(null);
      } else {
        await axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm({ description: "", amount: "", category: "", type: "" });
      fetchTransactions();
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTransactions();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Start editing a transaction
  const editTransaction = (t) => {
    setForm({
      description: t.description,
      amount: t.amount,
      category: t.category,
      type: t.type,
    });
    setEditingId(t._id);
  };

  // Chart setup
  useEffect(() => {
    if (!transactions.length) return;

    const ctx = document.getElementById("spendingChart");
    if (window.myChart) window.myChart.destroy();

    const incomeData = incomeCategories.map((cat) =>
      transactions
        .filter((t) => t.type === "income" && t.category === cat)
        .reduce((sum, t) => sum + Number(t.amount), 0)
    );

    const expenseData = expenseCategories.map((cat) =>
      transactions
        .filter((t) => t.type === "expense" && t.category === cat)
        .reduce((sum, t) => sum + Number(t.amount), 0)
    );

    window.myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [...incomeCategories, ...expenseCategories],
        datasets: [
          {
            data: [...incomeData, ...expenseData],
            backgroundColor: [
              "#6a0dad", "#b57edc", "#00b894", // income colors
              "#ff6f61", "#e17055", "#fdcb6e", "#d63031", "#0984e3", // expense colors
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" },
        },
      },
    });
  }, [transactions]);

  return (
    <div className="container">
      <h2 style={{ marginBottom: "1.5rem", color: "var(--purple-dark)" }}>
        Welcome, {user?.name}
      </h2>

      {/* Add/Edit Transaction Card */}
      <div className="card">
        <h3>{editingId ? "Edit Transaction" : "Add Transaction"}</h3>
        <form onSubmit={handleSubmit}>
        
    
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value, category: "" })}
            required
          >
            <option value="">Select Type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            {(form.type === "income" ? incomeCategories : expenseCategories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

            <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

           <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />

          <button type="submit">{editingId ? "Save Changes" : "Add Transaction"}</button>
        </form>
      </div>

      {/* Chart Card */}
      <div className="card">
        <h3>Spending & Income Breakdown</h3>
        <div style={{ width: "300px", height: "300px", margin: "0 auto" }}>
          <canvas id="spendingChart"></canvas>
        </div>
      </div>

      {/* Latest Transactions Card */}
      <div className="card">
        <h3>Latest Transactions</h3>
        {transactions.length === 0 && <p>No transactions yet.</p>}
        <ul>
          {transactions.map((t) => (
            <li key={t._id} style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                <strong>{t.description}</strong> ({t.type || "N/A"}) — {t.category}
              </span>
              <span>KES {t.amount}</span>
              <div>
                <button onClick={() => editTransaction(t)}>Edit</button>
                <button onClick={() => deleteTransaction(t._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
