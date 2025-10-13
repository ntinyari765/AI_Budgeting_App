import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import transactionRoutes from './routes/transactionroutes.js';
import userRoutes from './routes/userroutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/budget_app";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Basic route
app.get("/", (req, res) => {
  res.send("AI Budgeting API is running...");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


