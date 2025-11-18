import express from "express";
import { auth } from "../middleware/auth.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

router.use(auth); // protect all routes

// Get all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a transaction
router.post("/", async (req, res) => {
  try {
    const { type, category, amount, description } = req.body;

    const newTransaction = new Transaction({
      user: req.user.id,
      type,
      category,
      amount,
      description,
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a transaction
router.put("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    if (transaction.user.toString() !== req.user.id) return res.status(401).json({ message: "Unauthorized" });

    Object.assign(transaction, req.body);
    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a transaction
router.delete("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    if (transaction.user.toString() !== req.user.id) return res.status(401).json({ message: "Unauthorized" });

    await transaction.deleteOne();
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;


