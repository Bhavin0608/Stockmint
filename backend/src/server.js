// Demo server for test.
import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import authRouter from "./routes/auth.routes.js";
//const express = require('express');
//const connectDB = require('./config/db');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON payloads
app.use(express.json());

//All auth routes will be prefixed with /api/auth
app.use('/api/auth', authRouter);
// Call the db method
connectDB();

// Test Route
app.get('/', (req, res) => {
    res.json({ message: "Backend server is running smoothly!" });
});

app.listen(PORT, () => {
    console.log(`Server executing live on port http://localhost:5000`);
});
