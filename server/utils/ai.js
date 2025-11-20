// utils/ai.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

export const categorizeTransaction = async (description, type) => {
  if (!description || !type) return null;

  try {
    const categories = type === "income"
      ? "Salary, Business, Other"
      : "Food, Transport, Entertainment, Bills, Other";

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Classify this ${type} transaction into one of these categories: ${categories}. Transaction description: "${description}"`,
        },
      ],
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error("AI categorization error:", err);
    return null;
  }
};
