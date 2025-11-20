import express from "express";
import { auth } from "../middleware/auth.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// Protect all routes
router.use(auth);

// GET all transactions for logged in user
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ADD a transaction
router.post("/", async (req, res) => {
  try {
    const newTransaction = new Transaction({
      user: req.user.id,
      description: req.body.description,
      amount: req.body.amount,
      category: req.body.category,
      type: req.body.type, // income or expense
    });

    await newTransaction.save();
    res.json(newTransaction);
  } catch (error) {
    res.status(400).json({ error: "Error adding transaction" });
  }
});

// UPDATE a transaction
router.put("/:id", async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Not found" });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Update failed" });
  }
});

// DELETE a transaction
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Delete failed" });
  }
});

export default router;
