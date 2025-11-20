import express from "express";
import nodemailer from "nodemailer";
import { protect as authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();

// This assumes your User model has an "email" field
import User from "../models/User.js";

router.post("/", authMiddleware, async (req, res) => {
  const { description, amount, category, type } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "High Spending Alert",
      text: `Hi ${user.name},\n\nYou just added a high spending transaction:\n\nDescription: ${description}\nType: ${type}\nCategory: ${category}\nAmount: KES ${amount}\n\nConsider reviewing your spending habits.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "High spending alert sent via email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send email alert." });
  }
});

export default router;
