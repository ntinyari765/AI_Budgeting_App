import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getTransactions, addTransaction, updateTransaction, deleteTransaction } from "../services/transactionService";
import { getSuggestions } from "../utils/aiSuggestions";

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ type: "", category: "", amount: "", description: "" });

  const token = localStorage.getItem("token");

  // Fetch transactions on load
  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await getTransactions(token);
      setTransactions(data);
    };
    fetchTransactions();
  }, [token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    const newTrans = await addTransaction(form, token);
    setTransactions([newTrans, ...transactions]);
    setForm({ type: "", category: "", amount: "", description: "" });
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id, token);
    setTransactions(transactions.filter(t => t._id !== id));
  };

  // Generate AI suggestions
  const suggestions = getSuggestions(transactions);

  return (
    <div>
      <h2>Welcome, {user.name}</h2>

      {/* Add transaction form */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <h3>Add Transaction</h3>
        <form onSubmit={handleAdd}>
          <input name="type" placeholder="Type (income/expense)" value={form.type} onChange={handleChange} required />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
          <input name="amount" placeholder="Amount" type="number" value={form.amount} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <button
            type="submit"
            style={{
              background: "var(--purple)",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Add
          </button>
        </form>
      </div>

      {/* Transactions List */}
      <div className="card">
        <h3>Your Transactions</h3>
        {transactions.length === 0 && <p>No transactions yet.</p>}
        <ul>
          {transactions.map((t) => (
            <li key={t._id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #ddd" }}>
              <span>{t.type} - {t.category}: ${t.amount}</span>
              <span>
                <button onClick={() => handleDelete(t._id)} style={{ color: "red", cursor: "pointer" }}>Delete</button>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* AI Suggestions */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>AI Suggestions</h3>
        <ul>
          {suggestions.map((s, idx) => (
            <li key={idx} style={{ padding: "0.3rem 0" }}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

