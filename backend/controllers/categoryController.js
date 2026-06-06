const db = require("../config/db");

// GET /categories
const getCategories = async (req, res) => {
  try {
    const [categories] = await db.execute(
      "SELECT * FROM categories ORDER BY category_name ASC"
    );

    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching categories",
    });
  }
};

// POST /categories
const createCategory = async (req, res) => {
  try {
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const [existing] = await db.execute(
      "SELECT * FROM categories WHERE category_name = ?",
      [category_name]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    await db.execute(
      "INSERT INTO categories (category_name) VALUES (?)",
      [category_name]
    );

    res.status(201).json({
      message: "Category added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while adding category",
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
};