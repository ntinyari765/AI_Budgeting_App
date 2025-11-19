export const getSuggestions = (transactions) => {
  if (transactions.length === 0) return ["No transactions yet. Start adding!"];

  let incomeTotal = 0;
  let expenseTotal = 0;
  const categoryTotals = {};

  transactions.forEach((t) => {
    if (t.type.toLowerCase() === "income") incomeTotal += Number(t.amount);
    if (t.type.toLowerCase() === "expense") {
      expenseTotal += Number(t.amount);
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
    }
  });

  const suggestions = [];

  // Suggest saving 20% of income if expenses are high
  const savingGoal = Math.round(incomeTotal * 0.2);
  if (expenseTotal > incomeTotal * 0.8) {
    suggestions.push(`Consider saving around $${savingGoal} this month.`);
  } else {
    suggestions.push("Good job! Your spending is under control.");
  }

  // Highlight the highest expense category
  const categoryKeys = Object.keys(categoryTotals);
if (categoryKeys.length > 0) {
  const highestCategory = categoryKeys.reduce((a, b) =>
    categoryTotals[a] > categoryTotals[b] ? a : b
  );
  suggestions.push(`Spending spike in ${highestCategory}. Try to reduce it.`);
}


  return suggestions;
};
