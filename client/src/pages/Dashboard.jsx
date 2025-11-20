import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Chart } from "chart.js/auto";

const API_URL = "http://localhost:5000/api/transactions";
const AI_CATEGORY_URL = "http://localhost:5000/api/ai/categorize";
const AI_INSIGHTS_URL = "http://localhost:5000/api/ai/insights";

const incomeCategories = ["Salary", "Business", "Other"];
const expenseCategories = ["Food", "Transport", "Entertainment", "Bills", "Other"];
const HIGH_SPENDING_THRESHOLD = 10000; // KES

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ description: "", amount: "", category: "", type: "" });
  const [editingId, setEditingId] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [insights, setInsights] = useState([]);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      setTransactions(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  // Fetch AI category suggestion
  const fetchAISuggestion = async (description, type) => {
    if (!description || !type) return setAiSuggestion("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(AI_CATEGORY_URL, { description, type }, { headers: { Authorization: `Bearer ${token}` } });
      setAiSuggestion(res.data.category);
    } catch (err) {
      console.error("AI suggestion error:", err);
      setAiSuggestion("");
    }
  };

  // Fetch AI spending insights
  const fetchInsights = async () => {
    if (transactions.length === 0) return setInsights([]);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(AI_INSIGHTS_URL, { transactions }, { headers: { Authorization: `Bearer ${token}` } });
      setInsights(res.data.insights);
    } catch (err) {
      console.error("Insights fetch error:", err);
      setInsights([]);
    }
  };

  useEffect(() => { fetchInsights(); }, [transactions]);

  // Add or update transaction
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      let category = form.category;
      if (!category && form.type && form.description.length > 3) {
        await fetchAISuggestion(form.description, form.type);
        category = aiSuggestion || form.category;
      }

      const payload = { ...form, amount: Number(form.amount), category };

      if (payload.amount > HIGH_SPENDING_THRESHOLD) {
        // Optional: trigger backend email alert
        await axios.post(`${API_URL}/high-spending-alert`, payload, { headers: { Authorization: `Bearer ${token}` } });
      }

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        setEditingId(null);
      } else {
        await axios.post(API_URL, payload, { headers: { Authorization: `Bearer ${token}` } });
      }

      setForm({ description: "", amount: "", category: "", type: "" });
      setAiSuggestion("");
      fetchTransactions();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchTransactions();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Edit transaction
  const editTransaction = (t) => {
    setForm({ description: t.description, amount: t.amount, category: t.category, type: t.type });
    setEditingId(t._id);
    setAiSuggestion("");
  };

  // Chart
  useEffect(() => {
    if (!transactions.length) return;
    const ctx = document.getElementById("spendingChart");
    if (window.myChart) window.myChart.destroy();

    const incomeData = incomeCategories.map((cat) =>
      transactions.filter((t) => t.type === "income" && t.category === cat).reduce((sum, t) => sum + Number(t.amount), 0)
    );

    const expenseData = expenseCategories.map((cat) =>
      transactions.filter((t) => t.type === "expense" && t.category === cat).reduce((sum, t) => sum + Number(t.amount), 0)
    );

    window.myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [...incomeCategories, ...expenseCategories],
        datasets: [{ data: [...incomeData, ...expenseData], backgroundColor: ["#6a0dad", "#b57edc", "#00b894", "#ff6f61", "#e17055", "#fdcb6e", "#d63031", "#0984e3"] }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }
    });
  }, [transactions]);

  return (
    <div className="container">
      <h2 style={{ marginBottom: "1.5rem", color: "var(--purple-dark)" }}>Welcome, {user?.name}</h2>

      {/* Add/Edit Transaction */}
      <div className="card">
        <h3>{editingId ? "Edit Transaction" : "Add Transaction"}</h3>
        <form onSubmit={handleSubmit}>
          <select
            value={form.type}
            onChange={(e) => {
              const newType = e.target.value;
              setForm({ ...form, type: newType, category: "" });
              fetchAISuggestion(form.description, newType);
            }}
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
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {aiSuggestion && <p style={{ fontSize: "0.9rem", color: "#6a0dad" }}>AI Suggestion: <strong>{aiSuggestion}</strong></p>}

          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => {
              const newDesc = e.target.value;
              setForm({ ...form, description: newDesc });
              fetchAISuggestion(newDesc, form.type);
            }}
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

      {/* Chart */}
      <div className="card">
        <h3>Spending & Income Breakdown</h3>
        <div style={{ width: "300px", height: "300px", margin: "0 auto" }}>
          <canvas id="spendingChart"></canvas>
        </div>
      </div>

      {/* Latest Transactions */}
      <div className="card">
        <h3>Latest Transactions</h3>
        {transactions.length === 0 ? <p>No transactions yet.</p> : (
          <ul>
            {transactions.map((t) => (
              <li key={t._id} style={{ display: "flex", justifyContent: "space-between" }}>
                <span><strong>{t.description}</strong> ({t.type || "N/A"}) — {t.category}</span>
                <span>KES {t.amount}</span>
                <div>
                  <button onClick={() => editTransaction(t)}>Edit</button>
                  <button onClick={() => deleteTransaction(t._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* AI Insights */}
      <div className="card">
        <h3>AI Insights</h3>
        {insights.length === 0 ? <p>No insights yet.</p> :
          <ul>{insights.map((insight, idx) => <li key={idx}>{insight}</li>)}</ul>
        }
      </div>
    </div>
  );
};

export default Dashboard;
