import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import transactionRoutes from './routes/transactionroutes.js';
import userRoutes from './routes/userroutes.js';

dotenv.config();

const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true // allows sending cookies if needed later
}));

// Body parser
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("AI Budgeting API is running...");
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/budget_app";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



