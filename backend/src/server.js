// Demo server for test.
const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Call the db method
connectDB();

// Test Route
app.get('/', (req, res) => {
    res.json({ message: "Backend server is running smoothly!" });
});

app.listen(PORT, () => {
    console.log(`Server executing live on port http://localhost:5000`);
});
