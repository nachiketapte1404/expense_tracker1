const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const db = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
});

db.connect()
    .then(() => {
        console.log('Connected to PostgreSQL Database.');
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
    });

// Get all expenses
app.get('/expenses', (req, res) => {
    const userId = req.query.user_id || 1;

    const sql = `
        SELECT *
        FROM Expenses
        WHERE user_id = $1
        ORDER BY expense_date DESC
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(result.rows);
    });
});

// Add a new expense
app.post('/expenses', (req, res) => {
    const {
        amount,
        description,
        expense_date,
        category_id,
        user_id,
    } = req.body;

    const sql = `
        INSERT INTO Expenses
        (amount, description, expense_date, category_id, user_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
    `;

    db.query(
        sql,
        [
            amount,
            description,
            expense_date,
            category_id,
            user_id || 1,
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: 'Expense added successfully',
                expenseId: result.rows[0].id,
            });
        }
    );
});

// Edit an existing expense
app.put('/expenses/:id', (req, res) => {
    const { id } = req.params;

    const {
        amount,
        description,
        expense_date,
        category_id,
    } = req.body;

    const sql = `
        UPDATE Expenses
        SET
            amount = $1,
            description = $2,
            expense_date = $3,
            category_id = $4
        WHERE id = $5
        RETURNING id
    `;

    db.query(
        sql,
        [
            amount,
            description,
            expense_date,
            category_id,
            id,
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (result.rowCount === 0) {
                return res.status(404).json({
                    error: 'Expense not found',
                });
            }

            res.json({
                message: 'Expense updated successfully',
            });
        }
    );
});

// Remove an expense
app.delete('/expenses/:id', (req, res) => {
    const { id } = req.params;

    const sql = `
        DELETE FROM Expenses
        WHERE id = $1
        RETURNING id
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: 'Expense not found',
            });
        }

        res.json({
            message: 'Expense deleted successfully',
        });
    });
});


app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});