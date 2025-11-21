import express from "express";
import { auth } from "../middleware/auth.js";
import Transaction from "../models/transaction.js";
import nodemailer from "nodemailer";

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

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST new transaction
router.post("/", auth, async (req, res) => {
  try {
    const { description, amount, category, type } = req.body;

    // Create transaction
    const transaction = new Transaction({
      user: req.user.id,
      description,
      amount,
      category,
      type,
    });

    await transaction.save();

    // High spending alert threshold
    const HIGH_SPENDING_THRESHOLD = 10000;

    if (amount > HIGH_SPENDING_THRESHOLD) {
      const userEmail = req.user.email; // make sure user has email in DB
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "High Spending Alert",
        text: `Alert! You just added a transaction of KES ${amount} (${description}).`,
      });
    }

    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update transaction (optional similar logic)
router.put("/:id", auth, async (req, res) => {
  try {
    const { description, amount, category, type } = req.body;
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { description, amount, category, type },
      { new: true }
    );

    // High spending alert
    const HIGH_SPENDING_THRESHOLD = 20000;
    if (amount > HIGH_SPENDING_THRESHOLD) {
      const userEmail = req.user.email;
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "High Spending Alert",
        text: `Alert! You updated a transaction to KES ${amount} (${description}).`,
      });
    }

    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
