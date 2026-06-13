import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api";
import "./Dashboard.css";
import "../App.css";

function Dashboard() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    expense_date: '',
    category_id: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      loadExpenses();
      loadCategories();
    }
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const loadExpenses = async () => {
    try {
      const res = await api.fetchExpenses();
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.fetchCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateExpense(editingId, formData);
        showToast("Expense updated.");
      } else {
        await api.createExpense(formData);
        showToast("Expense added.");
      }
      setFormData({ amount: '', description: '', expense_date: '', category_id: '' });
      setEditingId(null);
      loadExpenses();
    } catch (err) {
      showToast("Something went wrong.", "error");
      console.error("Submission failed:", err);
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    const formattedDate = expense.expense_date ? expense.expense_date.split('T')[0] : '';
    setFormData({
      amount: expense.amount,
      description: expense.description,
      expense_date: formattedDate,
      category_id: expense.category_id
    });
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ amount: '', description: '', expense_date: '', category_id: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this expense?")) {
      try {
        await api.deleteExpense(id);
        showToast("Expense deleted.");
        loadExpenses();
      } catch (err) {
        showToast("Delete failed.", "error");
        console.error("Delete failed:", err);
      }
    }
  };

  const getCategoryName = (id) => {
    const cat = categories.find(c => String(c.id) === String(id));
    return cat ? cat.category_name : "—";
  };

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalCategories = categories.length;

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const monthlyExpense = expenses
  .filter((exp) => {
    const date = new Date(exp.expense_date);
    return (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  })
  .reduce((sum, exp) => sum + Number(exp.amount), 0);

const categoryTotals = {};

expenses.forEach((expense) => {
  const categoryName = getCategoryName(expense.category_id);

  categoryTotals[categoryName] =
    (categoryTotals[categoryName] || 0) +
    Number(expense.amount);
});

const highestCategory =
  Object.keys(categoryTotals).length > 0
    ? Object.keys(categoryTotals).reduce((a, b) =>
        categoryTotals[a] > categoryTotals[b] ? a : b
      )
    : "N/A";

  return (
    <div className="dashboard-page-wrapper">

      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
      )}

      {/* HEADER */}
      <div className="dashboard-header-row">
        <div>
          <h1>Expense Tracker</h1>
        </div>
      
        <button onClick={logout} className="btn btn-logout">Logout</button>
      </div>

      <div className="dashboard-cards">

  <div className="dashboard-card">
    <h3>Total Expenses</h3>
    <p>₹{total.toFixed(2)}</p>
  </div>

  <div className="dashboard-card">
    <h3>Total Entries</h3>
    <p>{expenses.length}</p>
  </div>

  <div className="dashboard-card">
    <h3>Total Categories</h3>
    <p>{totalCategories}</p>
  </div>

  <div className="dashboard-card">
    <h3>Top Category</h3>
    <p>{highestCategory}</p>
  </div>

  <div className="dashboard-card">
    <h3>This Month</h3>
    <p>₹{monthlyExpense.toFixed(2)}</p>
  </div>

</div>

      {/* SUMMARY PILL */}
      {expenses.length > 0 && (
        <div className="summary-bar">
          <span className="summary-count">{expenses.length} expense{expenses.length !== 1 ? 's' : ''}</span>
          <span className="summary-divider">·</span>
          <span className="summary-total">Total: <strong>₹{total.toFixed(2)}</strong></span>
        </div>
      )}

      {/* FORM CARD */}
      <div className={`form-card ${editingId ? 'form-card--editing' : ''}`}>
        <h3 className="form-card-title">
          {editingId ? "Edit Expense" : "Add New Expense"}
        </h3>
        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                name="amount"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="expense_date"
                value={formData.expense_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group form-group--full">
              <label>Description</label>
              <input
                type="text"
                name="description"
                placeholder="What did you spend on?"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group form-group--full">
              <label>Category</label>
              <select name="category_id" value={formData.category_id} onChange={handleChange} required>
                <option value="">— Select a category —</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update Expense" : "Save Expense"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* EXPENSE HISTORY */}
      <div className="history-section">
        <h3 className="history-section-title">Expense History</h3>

        {expenses.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>No expenses yet. Add your first one above.</p>
          </div>
        ) : (
          <div className="expense-table-container">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td className="col-date" data-label="Date">
                      {new Date(exp.expense_date).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="col-desc" data-label="Description">{exp.description}</td>
                    <td data-label="Category">
                      <span className="category-badge">
                        {getCategoryName(exp.category_id)}
                      </span>
                    </td>
                    <td className="col-amount" data-label="Amount">₹{Number(exp.amount).toFixed(2)}</td>
                    <td>
                      <div className="action-badge-group">
                        <button onClick={() => handleEdit(exp)} className="btn btn-edit">Edit</button>
                        <button onClick={() => handleDelete(exp.id)} className="btn btn-delete">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
export default Dashboard;