const db = require("../config/db");
const createExpense = async (req, res) => {
  try {
    const { amount, description, expense_date, category_id } = req.body;
    const userId = req.user.id;

    if (!amount || !description || !expense_date || !category_id) {
      return res.status(400).json({ message: "All fields are required" });
    }
    await db.execute(
      `INSERT INTO expenses (amount, description, expense_date, category_id, user_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [amount, description, expense_date, category_id, userId]
    );
    res.status(201).json({ message: "Expense added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while adding expense" });
  }
};
const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const [expenses] = await db.execute(
      `SELECT e.*, c.category_name 
       FROM expenses e
       LEFT JOIN categories c ON e.category_id = c.id
       WHERE e.user_id = ? 
       ORDER BY e.expense_date DESC`,
      [userId]
    );
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching expenses" });
  }
};

// Edit expense
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, expense_date, category_id } = req.body;
    const userId = req.user.id;
    const [expense] = await db.execute(
      "SELECT * FROM expenses WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (expense.length === 0) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }
    await db.execute(
      `UPDATE expenses 
       SET amount = ?, description = ?, expense_date = ?, category_id = ? 
       WHERE id = ?`,
      [amount, description, expense_date, category_id, id]
    );

    res.status(200).json({ message: "Expense updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating expense" });
  }
};

// Delete Expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const [expense] = await db.execute(
      "SELECT * FROM expenses WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (expense.length === 0) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }
    await db.execute("DELETE FROM expenses WHERE id = ?", [id]);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting expense" });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};