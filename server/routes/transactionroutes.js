import express from 'express';
import Transaction from '../models/Transaction.js';
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all transactions (protected)
router.get('/', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    res.json(transactions);
  } catch (err) {
    console.error("GET /transactions error:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST a new transaction (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { type, category, amount, description } = req.body;

    const transaction = new Transaction({
      user: req.user.id,
      type,
      category,
      amount,
      description,
    });

    await transaction.save();
    res.status(201).json(transaction);

  } catch (err) {
    console.error("POST /transactions error:", err);
    res.status(500).json({ message: err.message });
  }
});


// UPDATE (PUT)
router.put('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // ensure user owns this
      req.body,
      { new: true }
    );

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.json(transaction);
  } catch (err) {
    console.error("PUT /transactions/:id error:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE
router.delete('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id, // ensure user owns this
    });

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.json({ message: "Transaction removed" });
  } catch (err) {
    console.error("DELETE /transactions/:id error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;



