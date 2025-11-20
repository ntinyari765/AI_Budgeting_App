// server/routes/aiInsights.js
import express from "express";
import { protect as authMiddleware, protect } from "../middleware/authMiddleware.js";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", protect, async (req, res) => {
  const { transactions } = req.body; // array of user transactions

  if (!transactions || transactions.length === 0) {
    return res.json({ insights: ["No transactions to analyze yet."] });
  }

  try {
    const prompt = `
      You are a financial assistant.
      Analyze the following transactions and give concise insights:
      - Total income and expenses
      - Spending trends
      - Highest spending categories
      - Tips for saving money

      Transactions JSON: ${JSON.stringify(transactions)}
      Give 3-5 bullet points in plain text.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const insights = response.choices[0].message.content
      .trim()
      .split("\n")
      .filter((line) => line.length > 0);

    res.json({ insights });
  } catch (err) {
    console.error(err);
    res.status(500).json({ insights: ["Failed to generate insights."] });
  }
});

export default router;
