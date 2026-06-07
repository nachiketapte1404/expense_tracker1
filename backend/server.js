console.log("starting server.js");

// ERROR LISTENERS
// for debugging
// process.on('unhandledRejection', (reason, promise) => {
//     console.error('UNHANDLED REJECTION:', reason);
// });

// process.on('uncaughtException', (error) => {
//     console.error('UNCAUGHT EXCEPTION:', error.message);
//     console.error(error.stack);
// });

require('dotenv').config();
const express = require('express');
const cors = require('cors');


const db = require("./config/db"); 
//for debugging
// db.execute("SELECT 1")
//     .then(() => {
//         console.log("Database connection successful");
//     })
//     .catch((err) => {
//         console.error("DB connection failed with error:", err.message);
//     });


const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(express.json());

// for debugging
// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.path}`);
//     next();
// });

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
    console.log("✓ Root path matched!");
    res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});