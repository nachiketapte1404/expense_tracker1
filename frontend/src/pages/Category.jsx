import { useEffect, useState } from "react";
import { fetchCategories, createCategory } from "../api";
import "./Category.css";

function Category() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await fetchCategories();
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      setLoading(true);

      await createCategory({
        category_name: categoryName,
      });

      setCategoryName("");
      loadCategories();

      alert("Category added successfully");
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to add category"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-container">
      <div className="category-card">
        <h2>Category Management</h2>

        <form className="category-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="category-input"
          />

          <button
            type="submit"
            className="category-button"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>

        <h3>Available Categories</h3>

        {categories.length === 0 ? (
          <p className="empty-text">No categories found.</p>
        ) : (
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category.id} className="category-item">
                {category.category_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Category;