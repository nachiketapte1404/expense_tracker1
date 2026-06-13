-- ============================================
-- EXPENSE TRACKER - SEED DATA
-- ============================================
-- Run this after schema.sql to insert default categories
-- ============================================

USE expense_tracker;

-- Insert Default Categories
INSERT INTO categories (category_name) VALUES 
('Food'),
('Travel'),
('Shopping'),
('Entertainment'),
('Education'),
('Miscellaneous');
